'use client'; // クライアントコンポーネントとして宣言

import { useState, useEffect } from 'react';
import Link from 'next/link'; // next/link を使用してページ遷移を最適化

// ユーザーリストの型定義 (今回はstringの配列)
type UserSlug = string;

/**
 * Next.js App Routerのホームページコンポーネント。
 * public/user_list.json から新入生リストを読み込み、
 * 各プロフィールページへのリンクを表示します。
 */
export default function HomePage() {
  const [userSlugs, setUserSlugs] = useState<UserSlug[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // publicディレクトリ内のuser_list.jsonをフェッチ
    const fetchUsers = async () => {
      try {
        const response = await fetch('/user_list.json'); // publicフォルダ直下なので / から始まる
        if (!response.ok) {
          throw new Error('ユーザーリストの読み込みに失敗しました。ファイルが存在するか確認してください。');
        }
        const data: UserSlug[] = await response.json(); // string[] としてフェッチ
        setUserSlugs(data);
      } catch (err: any) {
        console.error('ユーザーリストのフェッチエラー:', err);
        setError(err.message || 'ユーザーリストの読み込み中に不明なエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []); // コンポーネントのマウント時に一度だけ実行

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <h1 className="text-2xl font-bold mb-4">メンバーリストを読み込み中...</h1>
        <p>しばらくお待ちください。</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-800 p-4">
        <h1 className="text-2xl font-bold mb-4">エラーが発生しました</h1>
        <p className="text-lg text-center mb-4">{error}</p>
        <p className="text-sm text-gray-600">
          `public/user_list.json` ファイルが正しい場所にあるか、JSON形式が正しいか確認してください。
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          C.A.C 新入生紹介ページ
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          新しい仲間たちの自己紹介ページを覗いてみよう！<br/>
          個性豊かなメンバーが皆さんを待っています。
        </p>
      </header>

      <main className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b-2 pb-4">
          🚀 メンバーリスト
        </h2>

        {userSlugs.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            まだ登録されているメンバーがいません。<br/>
            `public/user_list.json` にメンバーを追加してください。
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userSlugs.map((slug) => (
              <Link key={slug} href={`/users/${slug}`} passHref>
                {/* Link コンポーネントの子要素には、aタグまたはそれをラップした要素が必要です */}
                <div className="block cursor-pointer bg-blue-50 hover:bg-blue-100 p-5 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">{slug}</h3> {/* slug を表示名として使用 */}
                  <p className="text-gray-600">ページを見る →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>&copy; 2025 C.A.C All rights reserved.</p>
        <p>このページはNext.js (App Router) とVercelで構築されています。</p>
      </footer>
    </div>
  );
}
