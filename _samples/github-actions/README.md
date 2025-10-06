# 使用方法

プロジェクトルートに `.github/workflows` フォルダを作成し、 `project-deploy.yml` をコピーします。

初期状態では `main` ブランチにプッシュされた場合にビルドを実行し、  
`dist` フォルダに生成されたファイルを `production` ブランチにプッシュするように設定しています。

Githubのサイト上で `production` ブランチに切り替え、 `Code → Download ZIP` で生成ファイル一式をダウンロード出来ます。

> リポジトリの初期設定ではActionsの書き込み権限がありません。
> `Settings > Actions General > Workflow permissions` の設定を `Read and write permissions` に変更して下さい。

## Secrets

`${{ secrets.HOGEHOGE }}` となっている箇所は、リポジトリの Secretsへ追加しておく必要があります。  
Girhubのリポジトリページで `Settings > Secrets > New repository secret` をクリックして追加します。

# ファイル転送サンプル

> ⚠注意⚠
> 必ず `--dry-run` など実際には実行しないオプションでログを確認し、関係ないファイルが処理されない事を確認してから `--dry-run` を外して下さい。
> 
> 特にディレクトリの設定を間違うとサーバー上のファイルを上書きや削除で失うといった事も起こり得ます。必ず確認してから実行して下さい。

## ssh + rsync でファイル同期

rsync は転送速度も速く、差分ファイルのみ転送するので処理時間がかなり短いです。

| 追加する secrets    | 値                          |
| --------------- | -------------------------- |
| REMOTE_DIR      | 転送先リモートパス（※必ず最後に `/` を付ける） |
| SSH_PRIVATE_KEY | SSHプライベートキー                |
| SSH_SERVER      | SSHサーバー                    |
| SSH_USERNAME    | SSHユーザー名                   |
| SSH_PORT        | SSHポート番号                   |

```yaml
- name: Install SSH key
  uses: shimataro/ssh-key-action@v2
  with:
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    known_hosts: ${{ secrets.SSH_SERVER }}

- name: Rsync Deploy
  run: rsync -avzrh --dry-run -e "ssh -p ${{ secrets.SSH_PORT }} -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" ${{ env.LOCAL_DIR }}/ ${{ secrets.SSH_USERNAME }}@${{ secrets.SSH_SERVER }}:${{ secrets.REMOTE_DIR }}
```

ログを確認し問題なさそうであれば `--dry-run` を削除します。

### 不要なファイルを削除する

ローカルに無い不要なファイルをサーバーから削除するには `--delete` オプションを追加します。  
`--exclude` で除外するファイルを指定します。（ `.` から始まるBasic認証系のファイルを削除しない例）

```yaml
run: rsync -avzrh --delete --exclude=".*" --dry-run #...省略
```

ログを確認し問題なさそうであれば `--dry-run` を削除します。

## FTP でファイル転送

差分アップロード機能が無いため、全てのファイルを転送します。  
rsync に比べて処理時間は長くなります。

| 追加する secrets | 値          |
| ------------ | ---------- |
| REMOTE_DIR   | 転送先リモートパス  |
| FTP_SERVER   | FTPホストサーバー |
| FTP_USERNAME | FTPユーザーID  |
| FTP_PASSWORD | FTPパスワード   |

```yaml
- name: FTP Deploy
  uses: SamKirkland/FTP-Deploy-Action@2.0.0
  env:
    FTP_SERVER: ${{ secrets.FTP_SERVER }}
    FTP_USERNAME: ${{ secrets.FTP_USERNAME }}
    FTP_PASSWORD: ${{ secrets.FTP_PASSWORD }}
    REMOTE_DIR: ${{ secrets.REMOTE_DIR }}
    LOCAL_DIR: ./${{ env.LOCAL_DIR }}/
    ARGS: --parallel=20 --verbose --dry-run
```

ログを確認し問題なさそうであれば `--dry-run` を削除します。

> **v2.0.0 を使用する理由**
> 
> パラレル転送が出来るため転送するファイル量によっては最新バージョンより転送時間が短くなります。  
> 他のパラメーターは [README.md](https://github.com/SamKirkland/FTP-Deploy-Action/blob/9c4e4646b8b71d9ff86cfb1a44395ce36bf5ae56/README.md) を参照
> 
> ビルド時に差分ファイルが少ない場合、差分転送が出来る最新版の方が処理時間が短くなる場合があります。

### 不要なファイルを削除する

ローカルに無い不要なファイルをサーバーから削除するには `--delete` オプションを追加します。リモートディレクトリ内のファイルが全て削除されます。  
`--exclude-glob` で除外するファイルを指定します。（ `.` から始まるBasic認証系のファイルを削除しない例）

```yaml
ARGS: --parallel=20 --verbose --delete --exclude-glob=".*" --dry-run
```

ログを確認し問題なさそうであれば `--dry-run` を削除します。

## Github Pages に公開

Github Pages に公開します。Basic認証等は掛けれません。

```yaml
- name: Github Pages Deploy
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./${{ env.LOCAL_DIR }}
```

# 他のアクションサンプル

## Slackに通知する

`channel` は `#チャンネル名` か `@ユーザー名` で指定します。

| 追加する secrets      | 値                            |
| ----------------- | ---------------------------- |
| SLACK_WEBHOOK_URL | Slack の Incoming Webhook URL |

```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
    MATRIX_CONTEXT: ${{ toJson(matrix) }}
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    channel: '#チャンネル名'
    author_name: Deploy result
    job_name: 'Build and deploy'
    status: ${{ job.status }}
    fields: message,workflow,job,took
```