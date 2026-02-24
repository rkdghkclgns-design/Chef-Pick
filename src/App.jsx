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

// --- 쿠팡 파트너스 링크 생성 헬퍼 ---
const COUPANG_PARTNER_ID = 'rkdghkclgns';
const coupangSearchUrl = (query) =>
    `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(query)}&channel=user&sourceType=srp&landingType=search&subId=${COUPANG_PARTNER_ID}`;

// --- 실제 레시피 데이터 ---
const REAL_RECIPES = [
    {
        id: 'recipe-1',
        title: '백종원 김치찌개',
        author: '백종원',
        category: 'black-white',
        tags: ['김치', '찌개', '한식', '백종원', '국물요리'],
        date: '2026-02-25T00:00:00Z',
        img: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=800&auto=format&fit=crop',
        source: 'https://www.youtube.com/@paaborecipe',
        desc: '백종원 셰프의 시그니처 김치찌개. 잘 익은 묵은지와 돼지고기 앞다리살을 사용하여 깊고 진한 맛을 내는 정통 레시피입니다. 밥 한 그릇이 절로 비워지는 한국인의 소울푸드!',
        steps: [
            '묵은지 500g을 먹기 좋은 크기로 자릅니다. 김치 국물도 버리지 마세요.',
            '돼지고기 앞다리살 300g은 2cm 두께로 썰어줍니다.',
            '냄비에 참기름 1큰술을 두르고, 돼지고기를 중불에서 2분간 볶아 겉면을 익힙니다.',
            '돼지고기가 반쯤 익으면 김치를 넣고 함께 3분간 볶아 김치의 신맛을 날립니다.',
            '물 600ml(약 3컵)을 붓고, 김치국물 3큰술을 함께 넣습니다.',
            '고춧가루 1큰술, 국간장 1큰술, 설탕 반큰술로 간을 맞춥니다.',
            '센 불에서 끓어오르면 중불로 줄이고 10분간 보글보글 끓입니다.',
            '두부 반모를 2cm 두께로 썰어 찌개 위에 가지런히 올립니다.',
            '대파 1대를 송송 썰어 올리고 3분 더 끓이면 완성!',
            '꿀팁: 밥을 넣어 끓여 김치찌개 리조또로도 즐길 수 있습니다.'
        ],
        ings: [
            { name: '묵은지 500g', search: '묵은지 김치' },
            { name: '돼지고기 앞다리살 300g', search: '돼지고기 앞다리살' },
            { name: '두부 1모', search: '두부' },
            { name: '대파 1대', search: '대파' },
            { name: '고춧가루', search: '고춧가루' },
            { name: '참기름', search: '참기름' },
            { name: '국간장', search: '국간장' }
        ],
        globalFavs: 1842
    },
    {
        id: 'recipe-2',
        title: '류수영 계란볶음밥',
        author: '류수영',
        category: 'fridge',
        tags: ['자취', '초간단', '혼밥', '볶음밥', '계란', '5분요리'],
        date: '2026-02-24T00:00:00Z',
        img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800&auto=format&fit=crop',
        source: 'https://www.youtube.com/@ryusueyoung',
        desc: '배우 류수영의 만능 계란볶음밥! 냉장고에 있는 재료만으로 5분 안에 뚝딱 만들 수 있는 자취생 최애 레시피. 간장 버터의 고소한 맛이 중독성이 있습니다.',
        steps: [
            '찬밥 1공기(약 200g)를 준비합니다. 갓 지은 밥보다 찬밥이 더 맛있어요!',
            '계란 2개를 볼에 깨고, 소금 한 꼬집을 넣어 잘 풀어줍니다.',
            '팬에 식용유 1큰술을 두르고 강불로 가열합니다. 팬이 충분히 뜨거워야 해요!',
            '계란물을 팬에 붓고 5초간 기다린 뒤 바로 찬밥을 올립니다.',
            '주걱으로 밥을 잘게 부수며 빠르게 볶아줍니다. (약 1~2분)',
            '밥알이 하나하나 분리되면 간장 1.5큰술을 팬 가장자리에 둘러 넣습니다.',
            '버터 10g을 넣고 30초간 빠르게 섞어 코팅합니다.',
            '파기름용 송송 썬 대파를 넣고 10초 더 볶으면 완성!',
            '접시에 담고, 취향에 따라 참기름, 김가루, 깨를 뿌려주세요.'
        ],
        ings: [
            { name: '계란 2개', search: '계란 30구' },
            { name: '찬밥 1공기', search: '즉석밥' },
            { name: '진간장', search: '진간장' },
            { name: '무염버터', search: '무염버터' },
            { name: '대파', search: '대파' },
            { name: '김가루', search: '김가루' },
            { name: '참기름', search: '참기름' },
            { name: '통깨', search: '통깨' }
        ],
        globalFavs: 2156
    },
    {
        id: 'recipe-3',
        title: '에드워드 리 안심 스테이크',
        author: '에드워드 리',
        category: 'black-white',
        tags: ['고기', '프리미엄', '파티', '스테이크', '흑백요리사', '양식'],
        date: '2026-02-23T00:00:00Z',
        img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop',
        source: 'https://www.youtube.com/@Netflix',
        desc: '넷플릭스 흑백요리사에서 화제가 된 안심 스테이크 레시피. 레스토랑 수준의 퀄리티를 집에서도 재현할 수 있도록 단계별로 상세하게 설명합니다. 미디엄 레어 기준입니다.',
        steps: [
            '소 안심 400g을 냉장고에서 꺼내 30분간 실온에 둡니다. (고기가 차가우면 겉만 타요!)',
            '키친타월로 고기 표면의 수분을 완전히 제거합니다. 이 과정이 크러스트의 핵심!',
            '소금(꽃소금 or 말돈소금)을 고기 전체에 고르게 뿌립니다. 후추는 나중에!',
            '무쇠 팬(또는 두꺼운 팬)을 최강불로 3분 이상 달궈 연기가 살짝 날 때까지 가열합니다.',
            '식용유 1큰술을 두르고 고기를 올립니다. 앞뒤 각 2분씩 시어합니다.',
            '불을 중불로 줄이고 무염버터 30g, 마늘 3쪽, 로즈마리를 넣습니다.',
            '녹은 버터를 숟가락으로 떠서 고기 위에 반복해서 끼얹어줍니다. (Basting, 약 1분)',
            '팬에서 꺼내 도마 위에 올리고 알루미늄 호일로 느슨하게 감싸 5분간 레스팅합니다.',
            '레스팅이 끝나면 후추를 뿌리고 원하는 두께로 슬라이스합니다.',
            '접시에 담고 팬에 남은 버터 소스를 뿌려 완성. 감자퓌레나 샐러드와 곁들이세요.'
        ],
        ings: [
            { name: '소 안심 400g', search: '소 안심 스테이크' },
            { name: '무염버터 30g', search: '무염버터' },
            { name: '통마늘', search: '통마늘' },
            { name: '로즈마리', search: '로즈마리 허브' },
            { name: '말돈소금', search: '말돈 소금' },
            { name: '통후추', search: '통후추 그라인더' },
            { name: '올리브오일', search: '올리브오일' }
        ],
        globalFavs: 3201
    },
    {
        id: 'recipe-4',
        title: '승우아빠 알리오올리오',
        author: '승우아빠',
        category: 'viral',
        tags: ['자취', '간단', '양식', '파스타', '알리오올리오', '10분요리'],
        date: '2026-02-22T00:00:00Z',
        img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop',
        source: 'https://www.youtube.com/@seungwoodad',
        desc: '누적 조회수 1,000만의 승우아빠 알리오올리오 파스타. 마늘과 올리브오일의 심플한 조합인데 면수의 마법으로 레스토랑 맛을 내는 비밀 레시피입니다.',
        steps: [
            '냄비에 물 2L를 넣고 소금 2큰술을 넣어 강불에 끓입니다. (바닷물 정도 짠맛!)',
            '스파게티 면 200g을 넣고, 포장지 표시 시간보다 1분 적게(약 7분) 삶습니다.',
            '면을 삶는 동안, 팬에 올리브오일 4큰술을 넣고 약불에서 시작합니다.',
            '마늘 5~6쪽을 얇게 슬라이스해서 약불에서 천천히 볶습니다. (절대 강불 금지! 타요)',
            '마늘이 살짝 노릇해지면 페퍼론치노(건고추) 2~3개를 넣고 10초 볶습니다.',
            '면수(면 삶은 물) 한 국자(약 100ml)를 팬에 넣고, 센 불에서 흔들어 유화시킵니다.',
            '삶은 면을 바로 팬에 넣고 잘 버무립니다. 뻑뻑하면 면수를 조금씩 더 추가하세요.',
            '불을 끄고 올리브오일 1큰술을 마무리로 둘러 윤기를 냅니다.',
            '접시에 담고 파슬리 가루와 파르미지아노 치즈를 뿌리면 완성!'
        ],
        ings: [
            { name: '스파게티 면 500g', search: '스파게티 면' },
            { name: '올리브오일 (엑스트라 버진)', search: '엑스트라버진 올리브오일' },
            { name: '통마늘', search: '통마늘' },
            { name: '페퍼론치노(건고추)', search: '페퍼론치노' },
            { name: '파르미지아노 치즈', search: '파르미지아노 레지아노' },
            { name: '파슬리', search: '파슬리 건조' }
        ],
        globalFavs: 1567
    },
    {
        id: 'recipe-5',
        title: '백종원 돈코츠 라멘',
        author: '백종원',
        category: 'viral',
        tags: ['일식', '면요리', '국물', '라멘', '돈코츠', '보양식'],
        date: '2026-02-21T00:00:00Z',
        img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop',
        source: 'https://www.youtube.com/@paaborecipe',
        desc: '백종원 셰프의 간편 돈코츠(돼지뼈) 라멘. 정통 8시간 육수 대신 2시간 만에 진한 백탕 육수를 만드는 비법! 차슈와 반숙란 토핑까지 완벽하게 재현합니다.',
        steps: [
            '돼지뼈(등뼈) 1kg을 찬물에 30분 담가 핏물을 빼고, 끓는 물에 5분 데쳐 불순물을 제거합니다.',
            '깨끗이 씻은 뼈를 압력솥에 넣고 물 2L, 양파 1개, 대파 1대, 마늘 5쪽을 함께 넣습니다.',
            '추가 올리면 중불로 줄여 1시간 30분 끓입니다. (일반 냄비는 3시간)',
            '차슈용 삼겹살 덩어리 300g을 간장 100ml, 미림 50ml, 설탕 2큰술, 물 200ml에 넣고 약불에서 1시간 조립니다.',
            '반숙란: 물 끓을 때 냉장 계란을 넣고 정확히 6분 30초 삶은 뒤 얼음물에 식혀 껍질을 벗깁니다.',
            '차슈 조림장에 반숙란을 2시간 이상 재워 양념란을 만듭니다.',
            '육수가 완성되면 체에 걸러 뼈를 건져내고, 소금과 치킨스톡으로 간을 맞춥니다.',
            '라멘 생면을 끓는 물에 1분 30초 삶아 찬물에 헹굽니다.',
            '그릇에 육수를 붓고, 면 → 차슈 슬라이스 → 반숙란(반으로 가르기) → 파 → 김을 올립니다.',
            '마무리로 참기름 한 방울, 후추를 뿌리면 일본 현지 맛 완성!'
        ],
        ings: [
            { name: '돼지등뼈 1kg', search: '돼지등뼈' },
            { name: '삼겹살 덩어리 300g', search: '삼겹살 덩어리' },
            { name: '라멘 생면', search: '라멘 생면' },
            { name: '계란 6개', search: '계란 30구' },
            { name: '진간장', search: '진간장' },
            { name: '미림', search: '미림' },
            { name: '치킨스톡', search: '치킨스톡' },
            { name: '김(구운김)', search: '구운김' }
        ],
        globalFavs: 2890
    },
    {
        id: 'recipe-6',
        title: '백종원 국물떡볶이',
        author: '백종원',
        category: 'fridge',
        tags: ['간식', '매운맛', '분식', '떡볶이', '즉석', '야식'],
        date: '2026-02-20T00:00:00Z',
        img: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?q=80&w=800&auto=format&fit=crop',
        source: 'https://www.youtube.com/@paaborecipe',
        desc: '백종원의 3,000만 조회수 국물떡볶이. 고추장 + 고춧가루의 이중 양념으로 달콤매콤한 국물이 일품! 쫄깃한 밀떡과 진한 양념의 조화가 분식집 그 맛입니다.',
        steps: [
            '밀떡(또는 쌀떡) 400g을 찬물에 5분 담가 부드럽게 만듭니다.',
            '어묵 2장을 세모 모양으로 잘라줍니다.',
            '냄비에 물 500ml(2.5컵)을 넣고 끓입니다.',
            '양념 만들기: 고추장 2큰술 + 고춧가루 1큰술 + 간장 1큰술 + 설탕 2큰술 + 다진마늘 1큰술을 끓는 물에 풀어줍니다.',
            '양념이 녹으면 밀떡과 어묵을 넣고 중불에서 끓입니다.',
            '7~8분 끓이면서 가끔 저어줍니다. 떡이 부풀면서 말랑해지면 OK!',
            '대파 반 대를 어슷 썰어 넣고 1분 더 끓입니다.',
            '삶은 계란 1~2개를 반으로 갈라 올리면 비주얼 UP!',
            '불을 끄고 모짜렐라 치즈를 뿌리면 치즈떡볶이로 변신! (선택사항)'
        ],
        ings: [
            { name: '밀떡 400g', search: '밀떡' },
            { name: '어묵 사각', search: '사각어묵' },
            { name: '고추장', search: '고추장' },
            { name: '고춧가루', search: '고춧가루' },
            { name: '설탕', search: '설탕' },
            { name: '대파', search: '대파' },
            { name: '계란', search: '계란 30구' },
            { name: '모짜렐라 치즈', search: '모짜렐라 치즈' }
        ],
        globalFavs: 1645
    },
    {
        id: 'recipe-7',
        title: '자취요리신 카레라이스',
        author: '자취요리신',
        category: 'fridge',
        tags: ['자취', '간단', '카레', '혼밥', '10분요리', '초보'],
        date: '2026-02-19T00:00:00Z',
        img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop',
        source: 'https://www.youtube.com/@cookingsin',
        desc: '자취생이라면 꼭 알아야 할 초간단 카레라이스. 채소 듬뿍, 영양 만점이면서 냉장고 파먹기에 최적인 만능 레시피. 3일은 먹을 수 있는 양으로 만듭니다!',
        steps: [
            '감자 2개, 당근 1개, 양파 1개를 한입 크기(약 2cm)로 깍둑썰기합니다.',
            '닭가슴살 200g(또는 돼지고기)을 한입 크기로 자릅니다.',
            '냄비에 식용유 1큰술을 두르고 양파를 먼저 2분 볶아 투명하게 만듭니다.',
            '고기를 넣고 겉면이 하얗게 익을 때까지 2분 볶습니다.',
            '감자, 당근을 넣고 1분 더 볶습니다.',
            '물 700ml(약 3.5컵)을 붓고, 뚜껑을 덮어 센 불에 끓입니다.',
            '끓어오르면 중불로 줄이고, 감자가 익을 때까지 약 15분간 끓입니다.',
            '불을 끄고 카레 루 절반(약 3~4조각)을 넣어 잘 녹입니다.',
            '약불에서 저어가며 5분 더 끓여 걸쭉하게 만들면 완성!',
            '밥 위에 카레를 듬뿍 끼얹고, 취향에 따라 후쿠진즈케나 치즈를 올리세요.'
        ],
        ings: [
            { name: '카레 루 (오뚜기 or 하우스)', search: '카레 루' },
            { name: '감자 2개', search: '감자' },
            { name: '당근 1개', search: '당근' },
            { name: '양파 1개', search: '양파' },
            { name: '닭가슴살 200g', search: '닭가슴살' },
            { name: '후쿠진즈케 (선택)', search: '후쿠진즈케' }
        ],
        globalFavs: 987
    },
    {
        id: 'recipe-8',
        title: '홍석천 닭가슴살 샐러드',
        author: '홍석천',
        category: 'viral',
        tags: ['다이어트', '건강', '샐러드', '닭가슴살', '단백질', '저칼로리'],
        date: '2026-02-18T00:00:00Z',
        img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
        source: 'https://www.youtube.com/@hongseokcheon',
        desc: '연예인들이 즐겨먹는 고단백 저칼로리 샐러드. 홍석천 셰프의 특제 발사믹 드레싱이 핵심! 촉촉한 닭가슴살과 신선한 채소의 완벽한 조합으로 다이어트 식단의 끝판왕입니다.',
        steps: [
            '닭가슴살 200g에 소금, 후추를 뿌리고 10분 재워둡니다.',
            '냄비에 물을 끓이고, 닭가슴살을 넣은 뒤 불을 끄고 뚜껑을 덮어 15분 익힙니다. (촉촉함의 비밀!)',
            '익힌 닭가슴살을 찬물에 식힌 뒤 결대로 찢어줍니다.',
            '로메인, 루꼴라, 어린잎 등 샐러드 채소를 찬물에 씻고 물기를 완전히 제거합니다.',
            '방울토마토 8~10개를 반으로 가릅니다.',
            '아보카도 1개를 반으로 갈라 씨를 빼고 슬라이스합니다.',
            '삶은 계란 1개를 4등분합니다.',
            '드레싱: 올리브오일 2큰술 + 발사믹식초 1큰술 + 꿀 1작은술 + 머스타드 1작은술 + 소금 약간을 잘 섞습니다.',
            '넓은 접시에 채소를 깔고, 닭가슴살 → 토마토 → 아보카도 → 계란 순으로 올립니다.',
            '드레싱을 뿌리고 크루통이나 호두를 올려 마무리합니다.'
        ],
        ings: [
            { name: '닭가슴살 200g', search: '닭가슴살' },
            { name: '샐러드 채소 믹스', search: '샐러드 채소 믹스' },
            { name: '방울토마토', search: '방울토마토' },
            { name: '아보카도', search: '아보카도' },
            { name: '계란', search: '계란 30구' },
            { name: '발사믹 식초', search: '발사믹 식초' },
            { name: '올리브오일', search: '올리브오일' },
            { name: '디종 머스타드', search: '디종 머스타드' }
        ],
        globalFavs: 1234
    },
];

// --- 시그니처 로고 (주방 모자 + 콧수염) ---
const SignatureLogo = ({ onClick }) => (
    <button onClick={onClick} className="flex items-center gap-3 cursor-pointer bg-transparent border-none outline-none">
        <div className="relative flex flex-col items-center justify-center w-12 h-12 bg-slate-900 rounded-2xl shadow-xl border border-slate-700/50 group transition-all">
            <span className="text-xl leading-none group-hover:scale-110 transition-transform">👨‍🍳</span>
            <svg className="w-6 h-2 text-amber-500 mt-[-2px]" viewBox="0 0 24 8" fill="currentColor">
                <path d="M12 4C10 0 6 0 4 2C2 4 2 6 4 7C6 8 10 7 12 5C14 7 18 8 20 7C22 6 22 4 20 2C18 0 14 0 12 4Z" />
            </svg>
        </div>
        <div className="flex flex-col text-left">
            <h1 className="text-xl font-black italic tracking-tighter leading-none" style={{ fontFamily: 'Georgia, serif' }}>Chef's Pick</h1>
            <div className="flex items-center gap-1 mt-1">
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Signature Edition</span>
            </div>
        </div>
    </button>
);

export default function App() {
    // 실제 레시피 데이터 사용
    const [recipes, setRecipes] = useState(REAL_RECIPES);
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
                    {/* 왼쪽 여백 (균형 맞추기) */}
                    <div className="flex items-center gap-3 w-40">
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
                    </div>

                    {/* 중앙 로고 */}
                    <SignatureLogo onClick={() => { setView('user'); setActiveRecipe(null); setFilter('all'); setSearchQuery(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

                    {/* 오른쪽 설정 */}
                    <div className="flex items-center justify-end w-40">
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

                                        <button onClick={(e) => toggleFav(e, r.id)} className="absolute top-6 right-6 w-12 h-12 rounded-full glass flex items-center justify-center shadow-2xl transition-all active:scale-75 overflow-hidden" style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}>
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
                            <p className="text-slate-400 font-bold uppercase text-[11px] mb-6 flex items-center gap-4"><MapPin className="w-4 h-4 text-amber-500" /> Curated by {activeRecipe.author}</p>
                            {activeRecipe.desc && (
                                <p className="text-lg text-slate-600 leading-relaxed mb-20 bg-amber-50/50 border border-amber-100 rounded-3xl p-8">{activeRecipe.desc}</p>
                            )}
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
                        <div className="p-10 text-center bg-slate-50 border-b">
                            <h3 className="text-3xl font-black mb-6 text-slate-900 tracking-tighter italic" style={{ fontFamily: 'Georgia, serif' }}>{t.shop}</h3>
                            <p className="text-xs text-slate-400 mb-6">재료를 개별 또는 전체 구매할 수 있습니다</p>
                            {/* 전체 재료 일괄 구매 버튼 */}
                            <button
                                onClick={() => {
                                    activeRecipe.ings?.forEach((ing, i) => {
                                        setTimeout(() => {
                                            window.open(coupangSearchUrl(ing.search), '_blank');
                                        }, i * 300);
                                    });
                                    showToast(`${activeRecipe.ings?.length}개 재료 쿠팡에서 열림!`);
                                }}
                                className="w-full py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-[24px] font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                전체 재료 일괄 구매
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto space-y-3 no-scrollbar">
                            {activeRecipe.ings?.map((ing, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
                                    <div className="pr-4 flex-1">
                                        <p className="text-[10px] font-black text-amber-600 uppercase mb-1 tracking-widest">Coupang</p>
                                        <p className="text-base font-black text-slate-900 line-clamp-1">{ing.name}</p>
                                    </div>
                                    <a href={coupangSearchUrl(ing.search)} target="_blank" rel="noopener noreferrer" className="shrink-0 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black shadow-lg hover:bg-amber-600 transition-colors uppercase tracking-widest">구매</a>
                                </div>
                            ))}
                        </div>
                        <div className="p-10 border-t border-slate-50 text-center">
                            <p className="text-[11px] text-slate-400 mb-8 italic leading-relaxed">{t.legal}</p>
                            <button onClick={() => setShowShop(false)} className="w-full py-6 bg-black text-white rounded-[40px] font-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:bg-slate-800 transition-all">Close</button>
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
