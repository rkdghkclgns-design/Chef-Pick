import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Share2, Heart, Settings, Search, ChevronLeft, ShoppingBag, Globe, Loader2, Play, CheckCircle, Sparkles, MapPin, Database, Award, ChevronDown, TrendingUp, Lock, Zap } from 'lucide-react';

// ============================================================
// Firebase는 나중에 배포할 때 연결합니다.
// 지금은 로컬 데모 모드로 동작합니다.
// ============================================================

// --- 다국어 사전 (i18n) ---
const i18n = {
    ko: {
        logo: "Chef's Pick", sub: "1,000+ 지능형 레시피",
        search: "레시피, 재료, 테마 검색...", all: "전체",
        'black-white': "흑백요리사", fridge: "냉부해", viral: "트렌드",
        fav: "찜 목록", shop: "구매 리스트",
        cheap: "가성비 최저가", best: "인기 베스트",
        legal: "* 본 포스팅은 쿠팡 파트너스 활동의 일환으로 수수료를 제공받을 수 있습니다.",
        view_orig: "원작자 채널", buy_ing: "재료 구매",
        summary: "요리 핵심 요약", admin_title: "관리자 모드",
        seed: "빅데이터 1,000개 생성", sync: "AI 실시간 발굴",
        logout: "사용자 화면으로", trending: "추천 키워드",
        login_title: "Master Auth", login_placeholder: "비밀번호", login_btn: "확인"
    },
    en: {
        logo: "Chef's Pick", sub: "1,000+ Master Recipes",
        search: "Search recipes, tags...", all: "All",
        'black-white': "Black & White", fridge: "Fridge Chef", viral: "Trending",
        fav: "Favorites", shop: "Shopping List",
        cheap: "Best Price", best: "Best Seller",
        legal: "* This post contains affiliate links; we may earn a commission.",
        view_orig: "Source", buy_ing: "Shop Ingredients",
        summary: "Cooking Summary", admin_title: "Admin Console",
        seed: "Seed 1,000 Data", sync: "AI Smart Sync",
        logout: "Exit Admin", trending: "Trending",
        login_title: "Admin Access", login_placeholder: "Password", login_btn: "Login"
    },
    ja: {
        logo: "シェフの選択", sub: "1,000+ 厳選レシピ",
        search: "レシピ、材料、テーマ...", all: "すべて",
        'black-white': "白と黒", fridge: "冷蔵庫", viral: "トレンド",
        fav: "お気に入り", shop: "ショッピング",
        cheap: "最安値", best: "人気ベスト",
        legal: "* このサービスは提携リンクを含み、手数料を受け取ることがあります。",
        view_orig: "原文を見る", buy_ing: "材料購入",
        summary: "レシピ要約", admin_title: "管理パネル",
        seed: "1,000個生成", sync: "AI同期",
        logout: "終了", trending: "トレンド",
        login_title: "管理認証", login_placeholder: "パスワード", login_btn: "ログイン"
    },
    zh: {
        logo: "厨师的选择", sub: "1,000+ 顶级食谱",
        search: "搜索食谱、食材...", all: "全部",
        'black-white': "黑白大厨", fridge: "拜托了冰箱", viral: "热门趋势",
        fav: "收藏", shop: "购物篮",
        cheap: "最低价格", best: "人气精选",
        legal: "* 本服务包含联盟营销链接，可能会赚取佣金。",
        view_orig: "查看原文", buy_ing: "购买材料",
        summary: "烹饪摘要", admin_title: "管理面板",
        seed: "生成1000个", sync: "AI智能同步",
        logout: "退出", trending: "热门",
        login_title: "管理员登录", login_placeholder: "请输入密码", login_btn: "登录"
    }
};

// --- 로컬 데모용 샘플 레시피 데이터 ---
const DEMO_RECIPES = [
    {
        id: 'demo-1', title: 'Signature 김치찌개 by Master Lee #1', author: 'Master Lee',
        category: 'black-white', tags: ['김치', '찌개', '한식'], date: '2026-02-25T00:00:00Z',
        img: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=800&auto=format&fit=crop',
        source: 'https://www.youtube.com',
        steps: ['배추김치와 돼지고기를 준비합니다.', '냄비에 기름을 두르고 돼지고기를 볶습니다.', '김치를 넣고 함께 볶다가 물을 부어 끓입니다.', '두부를 썰어 넣고 5분간 더 끓이면 완성!'],
        ings: [{ name: '배추김치 500g', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }, { name: '돼지고기 앞다리살 300g', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }],
        globalFavs: 234
    },
    {
        id: 'demo-2', title: 'Signature 오일 파스타 by Chef Won #2', author: 'Chef Won',
        category: 'viral', tags: ['자취', '간단', '양식', '파스타'], date: '2026-02-24T00:00:00Z',
        img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop',
        source: 'https://www.youtube.com',
        steps: ['스파게티 면을 알덴테로 삶습니다.', '팬에 올리브오일과 마늘을 볶아 향을 냅니다.', '페퍼론치노를 넣고 면수를 한 국자 추가합니다.', '삶은 면을 넣고 잘 섞어 완성합니다.'],
        ings: [{ name: '스파게티 면 200g', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }, { name: '올리브오일', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }],
        globalFavs: 187
    },
    {
        id: 'demo-3', title: 'Signature 안심 스테이크 by Gordon #3', author: 'Gordon',
        category: 'black-white', tags: ['고기', '프리미엄', '파티', '스테이크'], date: '2026-02-23T00:00:00Z',
        img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop',
        source: 'https://www.youtube.com',
        steps: ['안심을 실온에 30분 꺼내 둡니다.', '소금, 후추로 시즈닝합니다.', '강불에 달군 팬에 버터를 녹이고 2분씩 시어합니다.', '알루미늄 호일로 감싸 5분 레스팅 후 서빙합니다.'],
        ings: [{ name: '소 안심 400g', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }, { name: '무염버터 30g', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }],
        globalFavs: 412
    },
    {
        id: 'demo-4', title: 'Signature 간장 볶음밥 by Sam Choi #4', author: 'Sam Choi',
        category: 'fridge', tags: ['자취', '초간단', '혼밥', '볶음밥'], date: '2026-02-22T00:00:00Z',
        img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800&auto=format&fit=crop',
        source: 'https://www.youtube.com',
        steps: ['찬밥과 계란, 파를 준비합니다.', '팬에 기름을 두르고 계란을 스크램블합니다.', '밥을 넣고 간장 2큰술을 둘러 강불에 볶습니다.', '송송 썬 파를 올려 완성합니다.'],
        ings: [{ name: '찬밥 1공기', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }, { name: '진간장', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }],
        globalFavs: 156
    },
    {
        id: 'demo-5', title: 'Signature 돈코츠 라멘 by Chef Ahn #5', author: 'Chef Ahn',
        category: 'viral', tags: ['일식', '면요리', '국물', '라멘'], date: '2026-02-21T00:00:00Z',
        img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop',
        source: 'https://www.youtube.com',
        steps: ['돼지뼈 육수를 8시간 우려냅니다.', '차슈를 만들어 슬라이스합니다.', '라멘 면을 삶아 그릇에 담습니다.', '육수를 붓고 차슈, 반숙란, 파를 올려 완성합니다.'],
        ings: [{ name: '라멘 생면 2인분', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }, { name: '돼지뼈 1kg', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }],
        globalFavs: 321
    },
    {
        id: 'demo-6', title: 'Signature 떡볶이 by Choi HS #6', author: 'Choi HS',
        category: 'fridge', tags: ['간식', '매운맛', '분식', '떡볶이'], date: '2026-02-20T00:00:00Z',
        img: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?q=80&w=800&auto=format&fit=crop',
        source: 'https://www.youtube.com',
        steps: ['떡과 어묵, 대파를 준비합니다.', '물에 고추장, 고춧가루, 설탕, 간장을 풀어 양념장을 만듭니다.', '양념장이 끓으면 떡과 어묵을 넣고 졸입니다.', '떡이 말랑해지면 파를 올려 완성합니다.'],
        ings: [{ name: '밀떡 400g', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }, { name: '고추장 3큰술', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }],
        globalFavs: 278
    },
    {
        id: 'demo-7', title: 'Signature 카레라이스 by Master Lee #7', author: 'Master Lee',
        category: 'fridge', tags: ['자취', '간단', '카레', '혼밥'], date: '2026-02-19T00:00:00Z',
        img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop',
        source: 'https://www.youtube.com',
        steps: ['감자, 당근, 양파를 깍둑썰기 합니다.', '고기를 먼저 볶고 채소를 넣어 함께 볶습니다.', '물을 넣고 끓으면 카레 루를 녹입니다.', '걸쭉해질 때까지 약불에 끓이면 완성!'],
        ings: [{ name: '카레 루 1/2박스', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }, { name: '감자 2개', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }],
        globalFavs: 143
    },
    {
        id: 'demo-8', title: 'Signature 치킨 샐러드 by Chef Won #8', author: 'Chef Won',
        category: 'viral', tags: ['다이어트', '건강', '샐러드'], date: '2026-02-18T00:00:00Z',
        img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
        source: 'https://www.youtube.com',
        steps: ['닭가슴살을 삶아 식힌 뒤 결대로 찢습니다.', '야채를 세척하고 한입 크기로 자릅니다.', '올리브오일, 레몬즙, 소금으로 드레싱을 만듭니다.', '접시에 담고 드레싱을 뿌려 완성합니다.'],
        ings: [{ name: '닭가슴살 200g', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }, { name: '샐러드 채소 믹스', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }],
        globalFavs: 198
    },
];

// --- 시그니처 로고 (주방 모자 + 콧수염) ---
const SignatureLogo = () => (
    <div className="flex items-center gap-3">
        <div className="relative flex flex-col items-center justify-center w-12 h-12 bg-slate-900 rounded-2xl shadow-xl border border-slate-700/50 group transition-all">
            <span className="text-xl leading-none group-hover:scale-110 transition-transform">👨‍🍳</span>
            <svg className="w-6 h-2 text-amber-500 mt-[-2px]" viewBox="0 0 24 8" fill="currentColor">
                <path d="M12 4C10 0 6 0 4 2C2 4 2 6 4 7C6 8 10 7 12 5C14 7 18 8 20 7C22 6 22 4 20 2C18 0 14 0 12 4Z" />
            </svg>
        </div>
        <div className="flex flex-col">
            <h1 className="text-xl font-black italic tracking-tighter leading-none" style={{ fontFamily: 'Georgia, serif' }}>Chef's Pick</h1>
            <div className="flex items-center gap-1 mt-1">
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Signature Edition</span>
            </div>
        </div>
    </div>
);

export default function App() {
    // 로컬 데모 모드: Firebase 대신 샘플 데이터 사용
    const [recipes, setRecipes] = useState(DEMO_RECIPES);
    const [lang, setLang] = useState('ko');
    const [view, setView] = useState('user');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");
    const [activeRecipe, setActiveRecipe] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [linkType, setLinkType] = useState('cheap');
    const [showShop, setShowShop] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const [seedProgress, setSeedProgress] = useState(0);
    const [userFavs, setUserFavs] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user_favs_fixed')) || []; }
        catch { return []; }
    });
    const [toast, setToast] = useState("");
    const [displayLimit, setDisplayLimit] = useState(12);

    const t = i18n[lang] || i18n.ko;

    // 즐겨찾기 로컬 저장
    useEffect(() => {
        localStorage.setItem('user_favs_fixed', JSON.stringify(userFavs));
    }, [userFavs]);

    // --- 즐겨찾기 토글 ---
    const toggleFav = useCallback((e, id) => {
        if (e) e.stopPropagation();
        setUserFavs(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    }, []);

    // --- 추천 키워드 ---
    const trendingKeywords = useMemo(() => [
        { ko: "자취요리", en: "Easy Meal", ja: "一人暮らし", zh: "独居食谱" },
        { ko: "흑백요리사", en: "Chef B&W", ja: "白と黒", zh: "黑白大厨" },
        { ko: "김치요리", en: "Kimchi", ja: "キムチ", zh: "泡菜" },
        { ko: "초간단", en: "Fast", ja: "超簡単", zh: "快手菜" },
        { ko: "고기", en: "Steak", ja: "ステーキ", zh: "牛排" }
    ], []);

    // --- 필터 + 검색 ---
    const filteredRecipes = useMemo(() => {
        let list = recipes || [];
        if (filter === 'fav') list = list.filter(r => userFavs.includes(r.id));
        else if (filter !== 'all') list = list.filter(r => r.category === filter);

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const associations = {
                "자취": ["간단", "1인분", "전자레인지", "자취", "혼밥"],
                "김치": ["김치", "찌개", "볶음밥", "kimchi"],
                "고기": ["스테이크", "불고기", "삼겹살", "meat", "beef"]
            };
            list = list.filter(r => {
                const titleMatch = r.title?.toLowerCase().includes(q);
                const tagMatch = r.tags && r.tags.some(tag => tag.toLowerCase().includes(q));
                let assocMatch = false;
                for (const [key, values] of Object.entries(associations)) {
                    if (q.includes(key)) {
                        assocMatch = values.some(val => r.title?.toLowerCase().includes(val) || (r.tags && r.tags.includes(val)));
                    }
                }
                return titleMatch || tagMatch || assocMatch;
            });
        }
        return list.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    }, [recipes, filter, searchQuery, userFavs]);

    // --- Actions ---
    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

    const handleAdminLogin = () => {
        if (adminPassword === "dbwngk9724!") {
            setView('admin');
            setShowLoginModal(false);
            setAdminPassword("");
            showToast("Master access granted.");
        } else {
            showToast("Invalid Key.");
        }
    };

    // 로컬 데모 시딩: Firebase 없이 클라이언트에서 샘플 데이터 추가
    const runSeeding = async () => {
        if (!confirm("로컬 데모 모드: 1,000개의 샘플 데이터를 생성하시겠습니까?")) return;
        setIsSeeding(true);
        const authors = ['Master Lee', 'Chef Won', 'Sam Choi', 'Choi HS', 'Gordon', 'Chef Ahn'];
        const dishes = [
            { name: '김치찌개', tags: ['김치', '찌개', '한식'], img: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=800&auto=format&fit=crop' },
            { name: '오일 파스타', tags: ['자취', '간단', '양식'], img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop' },
            { name: '안심 스테이크', tags: ['고기', '프리미엄', '파티'], img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop' },
            { name: '간장 볶음밥', tags: ['자취', '초간단', '혼밥'], img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800&auto=format&fit=crop' },
            { name: '돈코츠 라멘', tags: ['일식', '면요리', '국물'], img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop' }
        ];
        const cats = ['black-white', 'fridge', 'viral'];

        const newRecipes = [];
        const TOTAL = 1000;
        for (let i = 0; i < TOTAL; i++) {
            const dishObj = dishes[Math.floor(Math.random() * dishes.length)];
            const author = authors[Math.floor(Math.random() * authors.length)];
            newRecipes.push({
                id: `seed-${i + 1}`,
                title: `Signature ${dishObj.name} by ${author} #${i + 1}`,
                author,
                category: cats[Math.floor(Math.random() * cats.length)],
                tags: dishObj.tags,
                date: new Date(Date.now() - i * 60000).toISOString(),
                img: dishObj.img,
                source: 'https://www.youtube.com',
                steps: ['준비된 재료를 손질합니다.', '셰프의 비법 소스를 더합니다.', '완벽한 조리법으로 완성합니다.'],
                ings: [{ name: dishObj.name + ' 주재료', cheap_code: 'bL4A4y', best_code: 'bL4A6z' }],
                globalFavs: Math.floor(Math.random() * 500)
            });
            if (i % 100 === 0) {
                setSeedProgress(Math.round((i / TOTAL) * 100));
                // UI 업데이트를 위한 마이크로 딜레이
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }
        setRecipes(newRecipes);
        setSeedProgress(100);
        showToast("1,000 Nodes Deployed (Local Demo).");
        setIsSeeding(false);
        setSeedProgress(0);
    };

    const totalGlobalTraffic = useMemo(() => {
        return recipes.reduce((a, b) => a + (b.globalFavs || 0), 0);
    }, [recipes]);

    return (
        <div className="min-h-screen text-slate-900 bg-white selection:bg-amber-100 selection:text-amber-900">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-slate-100">
                <div className="max-w-screen-xl mx-auto px-6 h-20 flex items-center justify-between">
                    <SignatureLogo />

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl hover:bg-white transition-all shadow-sm">
                                <Globe className="w-4 h-4 text-slate-400" />
                                <select
                                    value={lang}
                                    onChange={(e) => setLang(e.target.value)}
                                    className="appearance-none bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest pr-4 cursor-pointer"
                                >
                                    <option value="ko">KR</option>
                                    <option value="en">EN</option>
                                    <option value="ja">JP</option>
                                    <option value="zh">CN</option>
                                </select>
                                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-4 pointer-events-none" />
                            </div>
                        </div>
                        <div className="h-6 w-[1px] bg-slate-100 hidden sm:block mx-1"></div>
                        <button onClick={() => setShowLoginModal(true)} className="p-3 text-slate-400 hover:text-black hover:bg-slate-50 rounded-2xl transition-all">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {view === 'user' && (
                    <div className="max-w-screen-xl mx-auto px-6 pb-6 animate-fade-in">
                        <div className="relative mb-5">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t.search}
                                className="w-full bg-slate-50 border border-slate-100 rounded-[32px] py-4 pl-14 pr-6 text-base font-bold outline-none focus:bg-white focus:ring-4 ring-amber-500/5 transition-all shadow-sm"
                            />
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>

                        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                            <div className="flex items-center gap-1.5 shrink-0 bg-slate-900 text-white px-3 py-2 rounded-xl shadow-lg">
                                <TrendingUp className="w-3 h-3 text-amber-400" />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none pt-0.5">{t.trending}</span>
                            </div>
                            {trendingKeywords.map((kw, i) => (
                                <button key={i} onClick={() => setSearchQuery(kw[lang])} className="shrink-0 px-5 py-2 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-500 hover:border-amber-400 hover:text-amber-600 transition-all shadow-sm">
                                    #{kw[lang]}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-5">
                            {['all', 'black-white', 'fridge', 'viral', 'fav'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-6 py-2.5 rounded-2xl whitespace-nowrap text-[11px] font-black uppercase tracking-widest transition-all border ${filter === cat ? 'bg-black text-white border-black shadow-xl scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                                >
                                    {cat === 'fav' ? (
                                        <span className="flex items-center gap-1.5">
                                            <Heart className={`w-3 h-3 ${userFavs.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                                            {t.fav}
                                        </span>
                                    ) : (
                                        t[cat] || cat
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* Main View */}
            <main className="max-w-screen-xl mx-auto p-6 pb-32">
                {view === 'user' ? (
                    <div className="space-y-12">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <Award className="w-5 h-5 text-amber-500" />
                                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Master's Signature</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-4 py-1.5 rounded-full">{filteredRecipes.length.toLocaleString()} ITEMS</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                            {filteredRecipes.slice(0, displayLimit).map(r => (
                                <div key={r.id} className="group relative bg-white rounded-[56px] overflow-hidden border border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all cursor-pointer" onClick={() => setActiveRecipe(r)}>
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        <img src={r.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent opacity-80" />

                                        <button onClick={(e) => toggleFav(e, r.id)} className="absolute top-6 right-6 w-12 h-12 rounded-3xl glass flex items-center justify-center shadow-2xl transition-all active:scale-75">
                                            <Heart className={`w-5 h-5 ${userFavs.includes(r.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                                        </button>

                                        <div className="absolute bottom-10 left-10 right-10 text-white">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="px-3 py-1 rounded-xl bg-amber-500 text-[8px] font-black uppercase tracking-widest text-slate-900 leading-none">ELITE</span>
                                                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">#{r.category}</span>
                                            </div>
                                            <h2 className="text-3xl font-black leading-[1.05] tracking-tighter mb-2 line-clamp-2">{r.title}</h2>
                                            <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.3em]">Curated by {r.author}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredRecipes.length > displayLimit && (
                            <button onClick={() => setDisplayLimit(prev => prev + 12)} className="w-full py-8 mt-12 bg-white border border-slate-200 rounded-[48px] text-slate-400 font-black text-xs uppercase tracking-[0.5em] hover:bg-slate-50 transition-all shadow-sm">
                                Explore More
                            </button>
                        )}
                    </div>
                ) : (
                    /* --- ADMIN VIEW --- */
                    <div className="space-y-10 animate-fade-in">
                        <div className="bg-slate-900 text-white p-12 rounded-[64px] shadow-2xl border border-slate-800 flex justify-between items-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-4xl font-black italic tracking-tighter mb-2">{t.admin_title}</h2>
                                <p className="text-[11px] text-amber-500 font-black uppercase tracking-[0.4em]">Global Node Control</p>
                            </div>
                            <button onClick={() => setView('user')} className="relative z-10 bg-white/10 hover:bg-white/20 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all">
                                {t.logout}
                            </button>
                            <Sparkles className="absolute -right-10 -top-10 w-64 h-64 opacity-10 text-white" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
                                <Database className="w-6 h-6 text-slate-900 mb-6" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Index Volume</p>
                                <h4 className="text-4xl font-black tracking-tighter text-slate-900">{recipes?.length?.toLocaleString() || 0}</h4>
                            </div>
                            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
                                <Globe className="w-6 h-6 text-blue-500 mb-6" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Traffic Total</p>
                                <h4 className="text-4xl font-black tracking-tighter text-slate-900">{totalGlobalTraffic.toLocaleString()}</h4>
                            </div>
                            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
                                <Heart className="w-6 h-6 text-red-500 mb-6" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Engagement</p>
                                <h4 className="text-4xl font-black tracking-tighter text-slate-900">
                                    {recipes?.reduce((a, b) => a + (b.globalFavs || 0), 0).toLocaleString()}
                                </h4>
                            </div>
                        </div>

                        <section className="bg-white rounded-[64px] p-20 border border-slate-100 text-center shadow-xl relative overflow-hidden group">
                            <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-10">
                                <Play className="w-8 h-8 text-orange-600 fill-current" />
                            </div>
                            <h3 className="text-4xl font-black mb-6 tracking-tighter leading-none">{t.seed}</h3>
                            <p className="text-base text-slate-400 font-medium max-w-lg mx-auto mb-16 leading-relaxed">
                                1,000개의 고유한 마스터 레시피와 검색 태그를 로컬 데모에 생성합니다.
                            </p>
                            <button disabled={isSeeding} onClick={runSeeding} className="w-full max-w-md py-7 bg-slate-900 text-white rounded-[40px] font-black text-base active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 mx-auto disabled:opacity-50">
                                {isSeeding ? <Loader2 className="animate-spin w-6 h-6" /> : <Zap className="w-5 h-5 fill-current text-amber-400" />}
                                {isSeeding ? `SEEDING... ${seedProgress}%` : "INITIALIZE DATABASE"}
                            </button>
                        </section>
                    </div>
                )}
            </main>

            {/* [MODAL] Master Auth Login */}
            {showLoginModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-xs rounded-[56px] p-10 text-center shadow-2xl">
                        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-10">
                            <Lock className="w-7 h-7 text-slate-900" />
                        </div>
                        <h3 className="font-black text-2xl mb-2 tracking-tighter uppercase text-slate-900">{t.login_title}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">Protected Access</p>

                        <input
                            type="password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder={t.login_placeholder}
                            className="w-full bg-slate-50 border-none rounded-3xl p-6 text-center text-3xl font-black mb-8 outline-none focus:ring-4 ring-amber-500/10"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                        />

                        <button onClick={handleAdminLogin} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-sm shadow-xl active:scale-95 transition-all uppercase mb-4 tracking-widest">{t.login_btn}</button>
                        <button onClick={() => setShowLoginModal(false)} className="text-slate-300 font-bold text-xs uppercase tracking-widest">Cancel</button>
                    </div>
                </div>
            )}

            {/* Recipe Detail Modal */}
            {activeRecipe && (
                <div className="fixed inset-0 z-[70] bg-white overflow-y-auto animate-fade-in">
                    <div className="sticky top-0 z-10 p-6 flex justify-between bg-white/90 backdrop-blur-xl border-b border-slate-50">
                        <button onClick={() => setActiveRecipe(null)} className="w-14 h-14 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 hover:text-black transition-all"><ChevronLeft /></button>
                        <div className="flex gap-3">
                            <button onClick={() => { if (navigator.share) navigator.share({ url: window.location.href }); else showToast("Link Copied"); }} className="w-14 h-14 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400"><Share2 className="w-5 h-5" /></button>
                            <button onClick={(e) => toggleFav(e, activeRecipe.id)} className="w-14 h-14 bg-slate-50 rounded-3xl flex items-center justify-center">
                                <Heart className={`w-5 h-5 ${userFavs.includes(activeRecipe.id) ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
                            </button>
                        </div>
                    </div>
                    <div className="max-w-screen-md mx-auto p-6 md:p-24">
                        <div className="relative rounded-[80px] overflow-hidden shadow-2xl mb-24 aspect-square md:aspect-video">
                            <img src={activeRecipe.img} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="max-w-2xl mx-auto">
                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="px-5 py-2 bg-slate-900 text-white text-[9px] font-black uppercase rounded-full tracking-[0.3em]">SIGNATURE ELITE</span>
                                {activeRecipe.tags?.map((tg, idx) => (
                                    <span key={idx} className="px-5 py-2 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded-full">#{tg}</span>
                                ))}
                            </div>
                            <h2 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter leading-[0.85]" style={{ fontFamily: 'Georgia, serif' }}>{activeRecipe.title}</h2>
                            <p className="text-slate-400 font-bold uppercase text-[11px] mb-20 flex items-center gap-4"><MapPin className="w-4 h-4 text-amber-500" /> Curated by {activeRecipe.author}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-24">
                                <a href={activeRecipe.source} target="_blank" rel="noopener noreferrer" className="py-8 bg-slate-50 border border-slate-100 rounded-[40px] flex flex-col items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all"><Globe className="w-6 h-6 text-indigo-500" /> {t.view_orig}</a>
                                <button onClick={() => setShowShop(true)} className="py-8 bg-black text-white rounded-[40px] flex flex-col items-center justify-center gap-2 font-black text-[11px] uppercase shadow-2xl active:scale-95 transition-all"><ShoppingBag className="w-6 h-6 text-amber-400" /> {t.buy_ing}</button>
                            </div>
                            <div className="space-y-16">
                                <h3 className="text-4xl font-black italic mb-10" style={{ fontFamily: 'Georgia, serif' }}>{t.summary}</h3>
                                {activeRecipe.steps?.map((s, i) => (
                                    <div key={i} className="flex gap-12 group pb-12 border-b border-slate-50">
                                        <span className="text-7xl font-black text-slate-100 group-hover:text-amber-200 transition-colors leading-none italic">{String(i + 1).padStart(2, '0')}</span>
                                        <p className="text-2xl font-medium text-slate-700 pt-2 flex-1">{s}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Shopping Modal */}
            {showShop && activeRecipe && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-2xl animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-[72px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                        <div className="p-14 text-center bg-slate-50 border-b">
                            <h3 className="text-3xl font-black mb-10 text-slate-900 tracking-tighter italic" style={{ fontFamily: 'Georgia, serif' }}>{t.shop}</h3>
                            <div className="flex p-2 bg-slate-200 rounded-[32px]">
                                <button onClick={() => setLinkType('cheap')} className={`flex-1 py-5 text-[10px] font-black rounded-[24px] transition-all ${linkType === 'cheap' ? 'bg-white text-slate-900 shadow-2xl' : 'text-slate-500'}`}>{t.cheap}</button>
                                <button onClick={() => setLinkType('best')} className={`flex-1 py-5 text-[11px] font-black rounded-[24px] transition-all ${linkType === 'best' ? 'bg-white text-slate-900 shadow-2xl' : 'text-slate-500'}`}>{t.best}</button>
                            </div>
                        </div>
                        <div className="p-10 overflow-y-auto space-y-4 no-scrollbar">
                            {activeRecipe.ings?.map((ing, i) => (
                                <div key={i} className="flex items-center justify-between p-8 bg-slate-50 rounded-[48px] border border-slate-100 hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
                                    <div className="pr-4">
                                        <p className="text-[10px] font-black text-amber-600 uppercase mb-2 tracking-widest">{linkType} pick</p>
                                        <p className="text-lg font-black text-slate-900 line-clamp-1">{ing.name}</p>
                                    </div>
                                    <a href={`https://link.coupang.com/a/${linkType === 'cheap' ? ing.cheap_code : ing.best_code}?subid=admin_link`} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-slate-900 text-white rounded-3xl text-[11px] font-black shadow-lg hover:bg-amber-600 transition-colors uppercase tracking-widest">Add</a>
                                </div>
                            ))}
                        </div>
                        <div className="p-14 border-t border-slate-50 text-center">
                            <p className="text-[11px] text-slate-400 mb-10 italic leading-relaxed">{t.legal}</p>
                            <button onClick={() => setShowShop(false)} className="w-full py-7 bg-black text-white rounded-[40px] font-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:bg-slate-800 transition-all">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] animate-fade-in">
                    <div className="bg-black/95 text-white px-12 py-6 rounded-full text-xs font-black shadow-2xl flex items-center gap-4 border border-slate-800">
                        <CheckCircle className="w-5 h-5 text-amber-500" />
                        <span className="tracking-tighter">{toast}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
