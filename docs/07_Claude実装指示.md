# Claude Code 実装指示

## 1. プロジェクト概要

このプロジェクトは、難波商店街地域BCPマップWebアプリケーションです。

目的は、災害時に各店舗の安否状況、被害状況、営業状況、支援要請を収集し、商店街管理者がBCPマップと管理ダッシュボードで全体状況を把握できるようにすることです。

## 2. 技術前提

以下の技術構成で画面モックを作成してください。

- Next.js
- TypeScript
- Tailwind CSS
- App Router
- DB接続なし
- Supabase接続なし
- 仮データ使用

## 3. 作業方針

まずはDB接続やSupabase連携は行わず、Next.js + TypeScript + Tailwind CSSで画面モックを作成してください。

`docs` フォルダ内の企画書、要件定義書、基本設計書、画面設計書、DB設計書、詳細処理設計書を読み取り、画面とコンポーネントを作成してください。

## 4. 作成する画面

### 店舗側画面

- `/login`
- `/store`
- `/store/safety`
- `/store/damage`
- `/store/business`
- `/store/support`
- `/store/confirm`
- `/store/complete`

### 管理者側画面

- `/admin`
- `/admin/dashboard`
- `/admin/map`
- `/admin/stores`
- `/admin/stores/[id]`
- `/admin/unreported`
- `/admin/support-requests`
- `/admin/proxy-input`
- `/admin/notifications`
- `/admin/disaster-mode`

## 5. 作成する共通ファイル

以下の構成を作成してください。

```text
components/
├── AppHeader.tsx
├── StatusBadge.tsx
├── MenuCard.tsx
├── DashboardCard.tsx
├── StoreTable.tsx
└── MockMap.tsx

lib/
└── mockData.ts

types/
└── index.ts
```

## 6. UI条件

- 店舗側画面はスマートフォンで使いやすいUIにしてください
- 管理者側画面はPC・タブレットで見やすいUIにしてください
- 選択式入力を中心にしてください
- 状態表示にはステータスバッジを使ってください
- ダッシュボードでは集計カードを表示してください
- 一覧画面ではテーブル表示を使ってください
- BCPマップは初期段階では本物の地図ライブラリを使わず、仮の商店街マップUIで構いません

## 7. BCPマップ表示条件

`/admin/map` にBCPマップ画面を作成してください。

初期段階ではLeafletなどの地図ライブラリを使わず、仮の商店街マップUIで構いません。

店舗ごとの状態を色分けしたマーカーで表示してください。

表示する状態は以下です。

- 営業可能
- 一部営業可能
- 営業停止
- 支援要請中
- 状況未確認
- 被害あり

店舗をクリックすると、以下を表示してください。

- 店舗名
- 安否状況
- 営業状況
- 支援要請
- 最終更新日時

## 8. 仮データ

`lib/mockData.ts` に以下の仮データを作成してください。

- 店舗データ
- 報告データ
- 支援要請データ
- 災害イベントデータ
- ダッシュボード集計用データ

## 9. 型定義

`types/index.ts` に以下の型を作成してください。

- User
- Store
- DisasterEvent
- Report
- SupportRequest
- BusinessStatus
- SafetyStatus
- DamageStatus

## 10. 注意事項

- Supabase接続はまだ行わないでください
- DB接続はまだ行わないでください
- 本格ログイン認証はまだ実装しないでください
- 画面遷移と仮データ表示だけでよいです
- 既存ファイルを壊さないでください
- 作業前に現在のファイル構成を確認してください
- 変更後は `npm run dev` または `npm run build` で確認してください
- エラーが出た場合は修正してください

## 11. 最初に実行する指示

以下の指示で作業を開始してください。

```text
このプロジェクトは、難波商店街地域BCPマップWebアプリケーションです。

docsフォルダ内の企画書、要件定義書、基本設計書、画面設計書、DB設計書、詳細処理設計書を読み取り、Next.js + TypeScript + Tailwind CSSで画面モックを作成してください。

まずはDB接続やSupabase連携は行わず、仮データで動く画面を作成してください。

作業前に現在のファイル構成を確認し、既存ファイルを壊さないでください。
変更後は npm run dev または npm run build で確認してください。
```
