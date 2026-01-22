// src/pages/AuthScreen.jsx
export default function AuthScreen({ onPlatformLogin, onCenterLogin }) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">

        {/* بلوك تعريفي بسيط عن المنصة */}
        <div className="hidden md:flex flex-col justify-center">
          <div className="mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-900 text-white font-bold text-xl">
              ب
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            منصة بصيرة لتحليل مؤشرات التوحّد
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            نظام مخصص للمستشفيات ومراكز التوحد لمساعدة الأطباء على إجراء
            فحوصات مبكرة، تتبع الفحوصات، وإدارة اشتراكات المراكز عبر لوحة تحكم
            واحدة.
          </p>
        </div>

        {/* كرت تسجيل الدخول */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-1 text-center">
            تسجيل الدخول
          </h2>
          <p className="text-xs text-slate-500 mb-6 text-center">
            اختر نوع الدخول المناسب
          </p>

          <div className="space-y-4">
            {/* دخول المراكز */}
            <div className="border rounded-xl p-4 hover:border-blue-500 transition">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    دخول مركز / عيادة
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    لاستخدام المنصة داخل مركز التوحد أو العيادة النفسية.
                  </p>
                </div>
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-700 text-sm">
                  مركز
                </span>
              </div>

              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  onCenterLogin();
                }}
              >
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    بريد المركز
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="clinic@center.sa"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium py-2.5 rounded-lg"
                >
                  دخول كـ مركز
                </button>
              </form>
            </div>

            {/* خط فاصل */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <div className="h-px flex-1 bg-slate-200" />
              <span>أو</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* دخول أدمن المنصة */}
            <div className="border rounded-xl p-4 bg-slate-50 hover:border-slate-400 transition">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    دخول أدمن المنصّة
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    لإدارة المراكز المشتركة، الخطط، وحركة الاشتراكات.
                  </p>
                </div>
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-900 text-white text-xs">
                  Admin
                </span>
              </div>

              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  onPlatformLogin();
                }}
              >
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    بريد الأدمن
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                    placeholder="admin@basira.sa"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-black text-white text-sm font-medium py-2.5 rounded-lg"
                >
                  دخول كـ أدمن المنصّة
                </button>
              </form>
            </div>
          </div>

          <p className="mt-6 text-center text-[11px] text-slate-400">
            هذه الواجهات تجريبية، وسيتم ربطها بالباك إند لاحقًا.
          </p>
        </div>
      </div>
    </div>
  );
}