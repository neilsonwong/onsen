function Alias (){}

Alias.title = function(raw){
    let lRaw = raw.toLowerCase();
    if (Alias.db.title[lRaw] !== undefined){
        return Alias.db.title[lRaw];
    }
    else {
        return raw;
    }
};

Alias.artist = function(raw){
    let lRaw = raw.toLowerCase();
    if (Alias.db.artist[lRaw] !== undefined){
        return Alias.db.artist[lRaw];
    }
    else {
        return raw;
    }
};

Alias.db = {};

Alias.db.title = {
    "sora wa takaku kaze wa utau" : "空は高く風は歌う",
    
    "kimi ni okuru uta" : "キミに贈る歌",

    "mikazuki" : "三日月",
    "blue days" : "ブルーデイズ",
    "koi kogarete mita yume" : "恋焦がれて見た夢",
    "te wo tsunagou" : "手をつなごう",
    "okaeri" : "おかえり",

    "suki" : "好き",

    "kimi no shiranai monogatari" : "君の知らない物語",
    "02. 君の知らない物語" : "君の知らない物語",
    "12. さよならメモリーズ" : "さよならメモリーズ",
    "sayonara memories" : "さよならメモリーズ",
    "utakata hanabi" : "うたかた花火",
    "yakusoku wo shiyou" : "約束をしよう",

    "ikenai borderline" : "いけないボーダーライン",
    "いけないボーダーライン～album version～" : "いけないボーダーライン",
    "rune ga pika to hikattara" : "ルンがピカッと光ったら",
    "ルンがピカッと光ったら～album version～" : "ルンがピカッと光ったら",

	"웨딩드레스 (Wedding Dress)" : "웨딩드레스",
	"Wedding Dress" : "웨딩드레스"
};

Alias.db.artist = {
	"park bom" : "박봄",

	"ayaka" : "絢香",

	"yuna itou" : "伊藤由奈",
	"reira starring yuna ito" : "伊藤由奈",

	"yonezawa madoka" : "米澤円",
	"小木曽雪菜" : "米澤円",
	"ogiso setsuna" : "米澤円",

	"yanagi nagi" : "やなぎなぎ",

	"b2st" : "비스트",
	"beast" : "비스트",

	"usa" : "うさ",

	"choucho" : "ちょうちょ",

	"nakamura maiko" : "中村舞子",

	"nishino kana" : "西野カナ",

	"namie amuro" : "安室奈美恵",

	"gazelle" : "ガゼル",

	"mizuki nana" : "水樹奈々",

	"ikeda ayako" : "池田綾子",
	"ayako ikeda" : "池田綾子",

    "yoko ishida" : "石田燿子",

	"kuripurin" : "栗プリン",

	"ailee" : "에일리",

	"sugawara sayuri" : "菅原紗由理",

	"walkure" : "ワルキューレ",
	"カナメδ安野希世乃、レイナδ東山奈央、マキナδ西田望見（from ワルキューレ）" : "ワルキューレ",

	"ayakura mei" : "綾倉盟",

	"ritsuka" : "リツカ",

	"uehara rena" : "上原れな",

    "haruna luna" : "春奈るな",

	"kawada mami" : "川田まみ",
	"mami kawada" : "川田まみ",

	"miura sally" : "三浦サリー",

	"masami okui" : "奥井雅美",

	"kara" : "카라",

	"wotamin" : "ヲタみん",

	"yokoyama masaru" : "横山克",
	"masaru yokoyama" : "横山克",

	"yui horie" : "堀江由衣",
	"horie yui" : "堀江由衣",

	"aoi eir" : "藍井エイル",

	"yasunori mitsuda" : "光田康典",

	"taneda risa" : "種田梨沙",

	"mika nakashima" : "中島美嘉",
	"nakashima mika" : "中島美嘉",

	"g.na" : "지나",

	"tamura yukari" : "田村ゆかり",

	"angela aki" : "アンジェラ・アキ",

	"kiyoura natsumi" : "清浦夏実",

	"hashimoto yukari" : "橋本由香利",

	"hashimoto miyuki" : "橋本みゆき",

	"hirano aya" : "平野綾",

	"iwasaki tarou" : "岩崎琢",
	"iwasaki taku" : "岩崎琢",

	"hatsune miku" : "初音ミク",

	"tenmon" : "天門",

	"inoue marina" : "井上麻里奈",

	"kobayashi shuntarou" : "小林俊太郎",

	"hayashibara megumi" : "林原めぐみ",
	"megumi hayashibara" : "林原めぐみ",

	"yuzu" : "ゆず",

	"fukui mai" : "福井舞",

	"kousaka honoka" : "新田恵海",
	"emi nitta" : "新田恵海",
	"nitta emi" : "新田恵海",

	"aikawa nanase" : "相川七瀬",

	"Wei Chen ft MBLAQ Lee Joon & Thunder" : "웨이천 & 이준(MBLAQ) & 천둥(MBLAQ)"
};

module.exports = Alias;