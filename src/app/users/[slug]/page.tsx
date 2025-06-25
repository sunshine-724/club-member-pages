'use client'; // このコンポーネントはクライアントサイドで動作することを宣言

import { useParams } from 'next/navigation'; // useRouter ではなく useParams をインポート
import { useState, useEffect } from 'react';

/**
 * Next.js App Routerの動的ルーティングページ
 * URLパス (例: /users/tanaka) の [slug] 部分に応じて、
 * 対応するユーザーのHTMLとCSSファイルを public/user_pages/ ディレクトリから読み込み、表示します。
 */
export default function UserPage() {
  // useParams を使って URL の動的な部分 (slug) を取得
  const params = useParams();
  const slug = params.slug as string; // slug が必ず文字列として存在することを想定

  const [htmlContent, setHtmlContent] = useState<string>('');
  const [cssContent, setCssContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // slug が存在しない場合は何もしない (URLで指定されるため通常は発生しないが、念のため)
    if (!slug) {
      setIsLoading(false);
      return;
    }

    const fetchUserPageContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 新入生が作成するHTMLファイルを読み込む
        // 例: public/user_pages/tanaka/index.html
        const htmlResponse = await fetch(`/user_pages/${slug}/index.html`);
        if (!htmlResponse.ok) {
          throw new Error(`HTMLファイルが見つかりません: /user_pages/${slug}/index.html`);
        }
        const htmlText = await htmlResponse.text();
        setHtmlContent(htmlText);

        // 新入生が作成するCSSファイルを読み込む
        // 例: public/user_pages/tanaka/style.css
        const cssResponse = await fetch(`/user_pages/${slug}/style.css`);
        if (!cssResponse.ok) {
          // CSSファイルが見つからない場合はエラーとせず、空のCSSとして扱う
          console.warn(`CSSファイルが見つかりません: /user_pages/${slug}/style.css。CSSは適用されません。`);
          setCssContent('');
        } else {
          const cssText = await cssResponse.text();
          setCssContent(cssText);
        }

      } catch (err: any) { // エラーオブジェクトの型を any で許容 (より厳密にする場合は Error 型をチェック)
        console.error('コンテンツの読み込み中にエラーが発生しました:', err);
        setError(`ページコンテンツの読み込みに失敗しました: ${err.message || '不明なエラー'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPageContent();
  }, [slug]); // slug が変更された時に再実行

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <p className="text-xl font-semibold">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-800 p-4">
        <h1 className="text-2xl font-bold mb-4">エラーが発生しました</h1>
        <p className="text-lg text-center">{error}</p>
        <p className="mt-4 text-sm text-gray-600">
          正しいURLか、ファイルが存在するか確認してください。<br/>
          （例: `/users/あなたのニックネーム`）
        </p>
      </div>
    );
  }

  /**
   * 注意点: `dangerouslySetInnerHTML` を使用しています。
   * これは、外部から渡されたHTML文字列を直接DOMに挿入するためのReactの機能です。
   * セキュリティ上のリスク (XSS攻撃など) があるため、信頼できるソースからのHTMLにのみ使用すべきです。
   * 今回は新入生が作成する「信頼できる」HTML/CSSを想定しており、学習目的のために使用しています。
   * 実際のプロダクション環境では、ユーザーが入力した内容を直接挿入する際には、
   * 必ずサニタイズ（無害化）処理を行うか、より安全なマークダウン変換ライブラリなどを利用してください。
   */
  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
      {/* 動的に読み込んだCSSを適用 */}
      <style dangerouslySetInnerHTML={{ __html: cssContent }} />

      {/* 動的に読み込んだHTMLを表示 */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}