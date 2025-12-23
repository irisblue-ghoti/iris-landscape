export const handwritingNotePrompt = (text: string, layout?: string) => {
  return {
    scenicGuide: {
      zh: `
      根据用户输入的角色和主题优化和增强图像生成提示，确保GPT-4O或其他扩散模型能够生成出色的视图。此提示用于生成旅游导览手记。

输入示例
景区名称：鼎湖山

输出示例：
请生成一张图片，模拟在一张略带纹理的纸张（比如米黄色或浅棕色）上手写的关于鼎湖山景区的讲解笔记。图片应呈现旅行日志/拼贴画风格，包含以下元素：
用手写字体（比如蓝色或棕色墨水）书写景区名称、地理位置、最佳游览季节、以及一两句吸引人的标语或简介。
包含几个主要看点或特色的介绍，使用编号列表或项目符号（例如：[列举2-3个具体看点，如“壮观的瀑布”，“陡峭的山壁”，“独特的植物”等]），并配有简短的手写说明。
用红色笔迹或其他亮色圈出或用箭头指向特别推荐的地点或活动（例如 [列举1-2个推荐项，如“蝴蝶谷”]）。
穿插一些与景区特色相关的简单涂鸦式小图画（例如：[根据景区特色想1-2个代表性图画，如“飞水潭“，”宝鼎园“等]）。
点缀几张关于该景区的、看起来像是贴上去的小幅照片（可以是风景照、细节照，风格可以略显复古或像宝丽来照片）。 整体感觉要像一份由热情导游或资深游客精心制作的、生动有趣的个人导览手记。

直接输出优化结果，无需任何解释。

用户输入：
${text}
      `,
      en: `
      Optimize and enhance image generation prompts based on user input roles and themes, ensuring that GPT-4O or other diffusion models can generate excellent views. This prompt is used to generate travel guide notes.

Input Example
Scenic Area Name: Dinghu Mountain

Output example:
Please generate an image to simulate a lecture note about Dinghu Mountain Scenic Area written on a slightly textured paper (such as beige or light brown). The image should present a travel diary/collage style, including the following elements:
Write the name of the scenic area, its geographical location, the best tourist season, and one or two attractive slogans or introductions in handwritten font (such as blue or brown ink).
An introduction containing several main highlights or characteristics, using numbered lists or bullet points (e.g. [list 2-3 specific highlights, such as "spectacular waterfalls," "steep mountain walls," "unique plants," etc.]), accompanied by brief handwritten explanations.
Use red handwriting or other bright colors to circle or point to specially recommended locations or activities with arrows (e.g. [List 1-2 recommended items, such as "Butterfly Valley"]).
Intersperse some simple graffiti style small drawings related to the characteristics of the scenic area (for example: [think of 1-2 representative drawings based on the characteristics of the scenic area, such as "Feishui Tan", "Baoding Garden", etc.]).
Add a few small photos about the scenic area that look like they have been posted (they can be landscape photos, detail photos, with a slightly retro style or resembling Polaroid photos). The overall feeling should be like a vivid and interesting personal guide notebook carefully crafted by enthusiastic tour guides or experienced tourists.

Directly output optimization results without any explanation.

User input:
${text}
      `,
      ja: `
      ユーザーが入力した役割とテーマの最適化と強化された画像生成ヒントに基づいて、GPT-4 Oまたはその他の拡散モデルが優れたビューを生成できることを確認します。このヒントは、観光案内手記を生成するために使用されます。

入力例
観光地名称：鼎湖山

出力例：
鼎湖山の観光地に関する解説ノートを少しテクスチャの入った紙（ベージュやベージュなど）に手書きで書いた写真を作成してください。画像には、次の要素を含む旅行ログ/コラージュスタイルを表示する必要があります。
青や茶色のインクなどの手書きのフォントで、観光地の名前、地理的位置、最適な観光シーズン、魅力的なスローガンやプロフィールを1つ2つ書きます。
いくつかの主な見所や特色の紹介を含み、番号リストや箇条書き（例：「壮観な滝」、「急峻な山壁」、「独特な植物」など、具体的な見所を2～3つ挙げる）を使用し、簡単な手書きの説明を添えている。
赤色の筆跡やその他の明るい色で囲んだり、特にお勧めの場所やイベントを矢印で指したりします（例えば、「蝶々の谷」などの1～2つのお勧めを挙げて）。
観光地の特色に関連した簡単な落書き式の小さな絵を織り交ぜてみましょう（例：「飛水潭」、「宝鼎園」など、観光地の特色に応じて1～2つの代表的な絵を考えてみましょう）。
この観光地についての、貼り付けられたように見える小さな写真を何枚か飾ります（風景写真、詳細写真、スタイルは少しレトロに見えるか、ボリビア写真のように見える）。全体的には、親切なガイドやベテラン観光客が丹念に作った、生き生きとした面白い個人ガイドの手記のような感じがします。

最適化結果を直接出力し、説明する必要はありません。

ユーザー入力：
${text}
      `,
    },
    travelNotes: {
      zh: `
     根据用户输入的角色和主题优化和增强图像生成提示，确保GPT-4O或其他扩散模型能够生成出色的视图。此提示用于生成旅游手帐插画。

输入示例
旅游目的地：北京

输出示例：
绘制一张色彩鲜艳、手绘风格的北京旅游手账插画，仿佛由一位充满好奇心的孩子用蜡笔精心创作。画面整体用柔和温暖的黄色背景，搭配鲜明的红色、蓝色、绿色等亮丽颜色，营造温馨而充满童趣的氛围。

插画中间绘制一条蜿蜒曲折的旅行路线，用箭头和虚线标记出各个经典地点，沿途包括：
- “第一站：吃碗老北京炸酱面！”
- “第二站：登顶景山，看紫禁城全景！”
- “第三站：逛逛神秘的故宫，注意：人超多！”
- “第四站：吃个冰糖葫芦，逛进胡同！”
- “第五站：去天坛，和爷爷奶奶一起晨练！”
- “第六站：到北海公园划船赏白塔！”
- “第七站：天安门前自拍打卡！”
- “第八站：去长城爬一爬，做个小勇士！”
- “最终站：尝一口地道的北京烤鸭，再买点纪念品回家！”

插画周围布满趣味元素：
- 拿着冰糖葫芦、吃着冰淇淋的开心小朋友；
- 指示牌：“小心迷路！”，“注意人流！”；
- 天安门、故宫、长城等经典地标用简单童趣风格画出；
- 贴纸式标语：“北京旅行记忆已解锁！”、“北京美食大冒险！”；
- 可爱的北京特色美食小图标（炸酱面、冰糖葫芦、烤鸭）；
- 欢乐的感叹：“原来北京这么好玩！”、“我还要再来一次！”

整体风格可爱而有趣，构图饱满生动，文字采用简洁可爱的手写体，仿佛带人进入一段童真又难忘的北京旅行回忆！

直接输出优化结果，无需任何解释。

用户输入：
${text}
      `,
      en: `
      Optimize and enhance image generation prompts based on user input roles and themes, ensuring that GPT-4O or other diffusion models can generate excellent views. This prompt is used to generate illustrations for travel accounts.

Input Example
Tourist destination: Beijing

Output example:
Draw a brightly colored, hand-painted illustration of a Beijing tourism account, as if it were carefully created by a curious child using crayons. The overall picture is set against a soft and warm yellow background, complemented by bright colors such as red, blue, and green, creating a warm and childlike atmosphere.

Draw a winding and twisting travel route in the middle of the illustration, marking various classic locations with arrows and dashed lines, including:
-"First stop: eat a bowl of old Beijing Zhajiangmian!"
-Second stop: Ascend Jingshan Mountain and enjoy the panoramic view of the Forbidden City
-Third stop: Explore the mysterious Forbidden City, note: there are too many people
-"The fourth stop: have a Bingtanghulu and stroll into the alley!"
-Fifth stop: Go to the Temple of Heaven and do morning exercises with your grandparents
-Sixth stop: Go boating and admire the White Pagoda at Beihai Park
-Seventh stop: Take a selfie in front of Tiananmen Square
-Eighth stop: Go climb the Great Wall and become a little warrior
-Final stop: Taste authentic Beijing roast duck and buy some souvenirs to go home

The illustrations are surrounded by interesting elements:
-Happy children with Bingtanghulu and ice cream;
-Signs: "Be careful of getting lost!", "Pay attention to the flow of people!";
-Classic landmarks such as Tiananmen Square, the Forbidden City, and the Great Wall are painted in a simple and playful style;
-Sticker style slogans: "Beijing travel memories unlocked!", "Beijing food adventure;
-Cute small icons of Beijing special food (Zhajiangmian, Bingtanghulu, roast duck);
-Joyful exclamation: "So Beijing is so fun!" "I want to do it again

The overall style is cute and interesting, the composition is full and vivid, and the text is written in simple and cute handwriting, as if taking people into a childlike and unforgettable Beijing travel memory!

Directly output optimization results without any explanation.

User input:
${text}
      `,
      ja: `
      ユーザーが入力した役割とテーマの最適化と強化された画像生成ヒントに基づいて、GPT-4 Oまたはその他の拡散モデルが優れたビューを生成できることを確認します。このヒントは、旅行手帳のイラストを生成するために使用されます。

入力例
旅行先：北京

出力例：
カラフルで手描き風の北京観光手帳のイラストを描き、好奇心に満ちた子供がクレヨンで丹念に創作したようだ。画面全体は柔らかで温かみのある黄色の背景で、鮮やかな赤、青、緑などの明るい色を組み合わせて、温かみがあって子供っぽい雰囲気を醸し出しています。

イラストの真ん中には、矢印と点線でそれぞれの古典的な場所をマークした、くねくねと曲がりくねった旅行ルートが描かれています。
-「最初の駅：古い北京ジャージャー麺を食べます！」
-「2つ目の駅：景山に登って、紫禁城の全景を見て！」
-「3つ目の駅：神秘的な故宮をぶらぶらして、注意：人が超多い！」
-「第4駅：氷糖葫芦を食べて、路地に入って！」
-「5つ目の駅：天壇に行って、おじいさんとおばあさんと一緒にジョギングをしよう！」
-「6つ目の駅：北海公園でボートをこいで白い塔を見る！」
-「7つ目の駅：天安門前で自撮りしてカードを打つ！」
-「8つ目の駅：万里の長城に登って、小さな勇者になる！」
-「最終駅：本場の北京ダックを食べて、お土産を買って帰ります！」

イラストの周りには趣味の要素があふれています。
-氷糖葫芦を持って、アイスクリームを食べている楽しい子供、
-案内板：「迷子に注意！」、「人の流れに注意！」、
-天安門、故宮、万里の長城などの古典的なランドマークはシンプルな子供の趣味で描かれています。
-シール式スローガン：「北京旅行の記憶はロック解除された！」、「北京美食大冒険！」、
-かわいい北京名物グルメアイコン（ジャージャー麺、氷糖葫芦、ダック）、
-喜びの感嘆：「北京はこんなに楽しかったのか！」、「また来ます！」

全体的なスタイルは可愛くて面白くて、構図は生き生きしていて、文字は簡潔でかわいい手書き体を採用して、まるで子供で忘れられない北京旅行の思い出に人を連れて行くようです！

最適化結果を直接出力し、説明する必要はありません。

ユーザー入力：
${text}
      `,
    },
    novelNotes: {
      zh: `
     根据用户输入的角色和主题优化和增强图像生成提示，确保GPT-4O或其他扩散模型能够生成出色的视图。此提示用于生成小说笔记。

输入示例
小说名：The Shadow over Innsmouth

输出示例：
生成一张图片，宽高比为 2:3，图片内的文字请使用中文。这张图片要模拟一位读者为小说《The Shadow over Innsmouth》制作的个人笔记页面。
风格： 拼贴画/剪贴簿美学，手绘元素与粘贴物品混合，背景为有纹理的纸张（例如像 Moleskine 笔记本或牛皮纸）。
请包含以下元素：
手写引语： 几段来自小说的经典或有冲击力的中文句子，用清晰但带有个人风格的手写字体书写。
人物涂鸦： 2-3位主要人物的简单涂鸦式头像速写，不必非常写实，更像是快速的印象捕捉。
人物关系图： 在人物涂鸦之间绘制箭头，并附有简短的手写英文文字标签，说明他们之间的关系（例如："Siblings", "Lovers", "Mentor & Student", "Rivals"）。
粘贴的书页一角： 一小块看起来很逼真的、模拟从实际小说书页上撕下或剪下的角落（上面能看到一些印刷的中文文字），看起来像是用胶带或胶水贴在笔记页面上的。
（可选）批注： 可能在引语或人物旁边有一些小的手写笔记或问号。
布局： 各元素应有机地排列，或许可以略微重叠，营造出一种经常使用的个人日记页面的感觉。
整体感觉： 引人思考的，分析性的，个人化的，视觉上吸引人的。

直接输出优化结果，无需任何解释。

用户输入：
${text}
      `,
      en: `
      Optimize and enhance image generation prompts based on user input roles and themes, ensuring that GPT-4O or other diffusion models can generate excellent views. This prompt is used to generate novel notes.


Input Example
Novel Title: The Shadow over Innsmouth

Output example:
Generate an image with an aspect ratio of 2:3, and use English for the text inside the image. This image simulates a personal note page created by a reader for the novel 'The Shadow over Innsmouth'.
Style: collage/scrapbook aesthetics, blending hand drawn elements with pasted items, with textured paper backgrounds (such as Moleskine notebooks or kraft paper).
Please include the following elements:
Handwritten quote: Several classic or impactful English sentences from a novel, written in clear but personal style handwriting.
Character Graffiti: Simple doodle style portraits of 2-3 main characters, not necessarily very realistic, but more like quick impression capture.
Character Relationship Diagram: Draw arrows between character graffiti and attach short handwritten English text labels to illustrate their relationships (e.g.: "Siblings", "Lovers", "Mentor & Student", "Rivals"）。
A corner of a pasted book page: a small, lifelike corner that simulates tearing or cutting from an actual novel page (with some printed English text visible on it), appearing to be taped or glued onto a note taking page.
(Optional) Annotations: There may be some small handwritten notes or question marks next to the quote or character.
Layout: Each element should be arranged organically, perhaps with slight overlap, to create a feeling of a frequently used personal diary page.
Overall feeling: thought-provoking, analytical, personalized, visually appealing.

Directly output optimization results without any explanation.

User input:
${text}
      `,
      ja: `
      ユーザーが入力した役割とテーマの最適化と強化された画像生成ヒントに基づいて、GPT-4 Oまたはその他の拡散モデルが優れたビューを生成できることを確認します。このヒントは小説ノートを生成するために使用されます。

入力例
小説名：The Shadow over Innsmouth

出力例：
アスペクト比が2:3の画像を生成します。画像内の文字は英語を使用してください。この画像は、小説「The Shadow over Innsmouth」のために読者が作成した個人ノートページをシミュレートします。
スタイル：コラージュ/クリップブックの美学、手描き要素と貼り付け物を混合し、背景はテクスチャのある紙（例えばMoleskineノートやクラフト紙）である。
次の要素を含めてください。
手書き引用：小説の古典やインパクトのある英語の文のいくつかは、はっきりしているが個人的なスタイルの手書きの書体で書かれている。
人物の落書き：2-3人の主要人物の簡単な落書き式の顔のスケッチは、非常に写実的である必要はなく、より速い印象的なキャプチャのようだ。
人物関係図：人物の落書きの間に矢印を描き、短い手書きの英字ラベルを付けて関係を説明します（例："Siblings", "Lovers", "Mentor & Student", "Rivals"）。
貼り付けられたページの隅：実際の小説のページからはがしたり切ったりしているように見える小さなブロック（印刷された英語文字がいくつか見える）が、テープや糊でノートのページに貼られているように見える。
（オプション）コメント：引用文や人物の横に小さな手書きのメモや疑問符がある場合があります。
レイアウト：各要素は有機的に配列され、少し重なって、よく使う個人日記ページのような感覚を醸し出すことができるかもしれません。
全体の感覚：人を思考させ、分析的、個人的、視覚的に人を引き付ける。

最適化結果を直接出力し、説明する必要はありません。

ユーザー入力：
${text}
      `,
    },
    handwritingNote: {
      zh: `
     就主题“${text}”创建简洁、视觉结构化的笔记。注释必须清晰地符合${layout}布局，其特征是：

-中等字体大小：可读性舒适。
-结构清晰：
-用“背景色”或“波浪下划线~”突出显示的要点。
-标准墨水的常规笔记。
-用不同的墨水颜色强调音符。
-插图：
-包括相关草图或手绘风格插图。
-允许在插图上直接进行钢笔风格的涂鸦或注释。
-配色方案：主注、强调注、突出风格。
-插图风格：详细的手绘、极简主义草图或带注释的杂志/照片剪切。
-注释：
-使用记号笔风格模拟笔记、更正和其他类似自发注释的古怪涂鸦。
-结合与主题相关的拼贴风格照片摘录，进行注释或涂鸦。
-语言文本精度限制（严格）：
-在“中文”中生成文本时，请遵守公认的词典和标准语法规则。
-对于中文或其他复杂文字的语言：
-确保每个字符或符号正确、标准且使用得当。
-仔细检查笔划顺序，避免不存在的变体，并在最终确定注释之前验证使用情况。

使用“中文”生成笔记，严格遵守视觉准则。

用户输入：
笔记主题：${text}
布局：${layout}
      `,
      en: `
      Create concise and visually structured notes based on the theme of '${text}'. Annotations must clearly conform to the ${layout} layout, characterized by:

-Medium font size: Comfortable readability.
-Clear structure:
-Highlight key points with "background color" or "wavy underline~".
-Standard ink for regular notes.
-Emphasize notes with different ink colors.
-Illustration:
-Including relevant sketches or hand drawn style illustrations.
-Allow direct pen style graffiti or annotations on illustrations.
-Color scheme: main note, emphasis note, highlighting style.
-Illustration style: detailed hand drawn, minimalist sketches, or annotated magazine/photo cutouts.
-Annotation:
-Simulate notes, corrections, and other quirky graffiti similar to spontaneous annotations using a marker pen style.
-Extract collage style photos related to the theme and annotate or doodle them.
-Language text accuracy limit (strict):
-When generating text in English, please follow recognized dictionaries and standard grammar rules.
-For languages with Chinese or other complex scripts:
-Ensure that each character or symbol is correct, standard, and used appropriately.
-Carefully check the stroke order to avoid non-existent variations, and verify usage before finalizing annotations.

Generate notes in English and strictly adhere to visual guidelines.

User input:
content language: English
note theme：${text}
layout：${layout}
      `,
      ja: `
      トピック'${text}'について簡潔で視覚的に構造化されたメモを作成します。注記は、次のような特徴を持つ${layout}レイアウトに明確に一致している必要があります。

-中程度のフォントサイズ：可読性があり快適。
-構造が明確：
-「背景色」または「波形下線~」で強調表示されるポイント。
-標準インクの通常のメモ。
-異なるインク色で音符を強調します。
-イラスト：
-関連するスケッチまたは手描きスタイルのイラストが含まれます。
-イラストにペンスタイルの落書きや注釈を直接行うことができます。
-配色スキーム：主注、強調注、強調スタイル。
-イラストスタイル：詳細な手描き、ミニマリズムスケッチ、または注釈付き雑誌/写真カット。
-コメント：
-マーカーペンスタイルを使用してノートをシミュレートし、自発的な注釈のような他の奇妙な落書きを修正します。
-トピックに関連するコラージュ風写真の抜粋を組み合わせて、注釈や落書きを行います。
-言語テキスト精度の制限（厳しい）：
-日本語でテキストを生成する場合は、公認辞書と標準文法規則に従ってください。
-中国語またはその他の複雑な文字の言語：
-各文字または記号が正しく、標準的で適切に使用されていることを確認します。
-ストロークの順序を注意深くチェックして、発生しないバリエーションを回避し、最終的にコメントを決定する前に使用状況を検証します。

日本語でメモを生成し、視覚的なガイドラインを厳格に遵守します。

最適化結果を直接出力し、説明する必要はありません。

ユーザー入力：
コンテンツ言語：日本語
メモテーマ：${text}
レイアウト：${layout}
      `,
    },
  };
};
