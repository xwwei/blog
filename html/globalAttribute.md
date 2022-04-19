# 【HTML】全局属性：
## accesskey
accesskey是html标签里的全局属性。

accesskey属性可以设定一个或者几个用来选择页面上的元素的快捷键。但不同操作系统里的操作会有所不同。

```html
<a href="//www.runoob.com/html/html-tutorial.html" accesskey="h">HTML 教程</a><br>
<a href="//www.runoob.com/css/css-tutorial.html" accesskey="c">CSS 教程</a>
```
- 在Windows系统中，同时按下 Alt键 和 accesskey 属性设置的键，就能快速选择到对应的元素。
- 在Mac系统中，同时按下 control键 加 option键 加 accesskey 属性设置的键，也能快速选择到对应的元素

有兼容性问题，opera不支持

## autocapitalize
autocapitalize 全局属性 是一个枚举属性，它控制用户输入/编辑文本输入时文本输入是否自动大写，以及如何自动大写。属性必须取下列值之一：
- off or none: 没有应用自动大写（所有字母都默认为小写字母）。
- on or sentences: 每个句子的第一个字母默认为大写字母；所有其他字母都默认为小写字母。
- words: 每个单词的第一个字母默认为大写字母；所有其他字母都默认为小写字母。
- characters: 所有的字母都默认为大写

有兼容性问题

## contenteditable
指示元素是否应该由用户编辑。如果是这样，浏览器会修改其小部件以允许编辑
- true或一个空字符串，表示该元素是可编辑的。
- false，表示该元素不可编辑。

如果给定的属性没有值，例如<label contenteditable>Example Label</label>，则其值被视为空字符串。

如果此属性缺失或其值无效，则其值继承自其父元素：因此，如果其父元素是可编辑的，则该元素是可编辑的。

请注意，尽管它的允许值包括trueand false，但此属性是枚举属性，而不是布尔属性。

您可以使用CSS属性设置用于绘制文本插入插入符号的颜色caret-color

有兼容性问题

## dir
dir是一个指示元素中文本方向的枚举属性。它的取值如下：
- ltr, 指从左到右，用于那种从左向右书写的语言（比如英语）；
- rtl, 指从右到左，用于那种从右向左书写的语言（比如阿拉伯语）；
- auto, 指由用户代理决定方向。它在解析元素中字符时会运用一个基本算法，直到发现一个具有强方向性的字符，然后将这一方向应用于整个元素。

这个属性对有不同语义的<bdo>元素是必须的。

这个属性在<bdi>元素中不可继承。未赋值时，它的默认值是auto。

这个属性可以被 CSS 属性direction和unicode-bidi覆盖，如果 CSS 网页有效且该元素支持这些属性的话。

由于文本的方向是和内容的语义而不是和表现相关，因此有可能的话，网页开发者使用这一属性而非 CSS 属性是被推荐的。这样，即使在不支持 CSS 或禁用 CSS 的浏览器中，文本也会正常显示。

auto 应当用于方向未知的数据，如用户输入的数据，最终保存在数据库中的数据。

有兼容性问题，IE不支持

## draggable
一种枚举属性，指示是否可以使用 Drag and Drop API 拖动元素。它可以有以下的值：
- true, 这表明元素可能被拖动
- false, 这表明元素可能不会被拖动

## dropzone
规定当被拖动的数据在拖放到元素上时，是否被复制、移动或链接。
- copy，表示drop将创建被拖动元素的副本
- move，表示拖动的元素将移动到此新位置。
- link，将创建一个指向拖动数据的链接。

没有主流浏览器支持 dropzone 属性。

## hidden
- hidden 属性规定对元素进行隐藏。
- 隐藏的元素不会被显示。
- 如果使用该属性，则会隐藏元素。
- 可以对 hidden 属性进行设置，使用户在满足某些条件时才能看到某个元素（比如选中复选框，等等）。然后，可使用 JavaScript 来删除 hidden 属性，使该元素变得可见

## itemid
项的唯一全局标识符。

## itemprop
用于向项添加属性。 每个HTML元素都可以指定一个itemprop属性，其中一个itemprop由一个名称和值对组成。

## itemref
只有不是具有itemscope属性的元素的后代，它的属性才可以与使用itemref项目相关联。它提供了元素ID列表（而不是itemids）以及文档中其他位置的其他属性。

## itemscope
itemscope（通常）与itemtype一起使用，以指定包含在关于特定项目代码块中的HTML。 itemscope创建Item并定义与之关联的itemtype的范围。 itemtype是描述项及其属性上下文的词汇表（例如schema.org）的有效URL。

## itemtype
指定将用于在数据结构中定义itemprops（项属性）的词汇表的URL。 itemscope用于设置数据结构中按itemtype设置的词汇表的生效范围。

## lang
帮助定义元素的语言:不可编辑元素所在的语言，或者应该由用户编写的可编辑元素的语言。该属性包含一个“语言标记”(由用连字符分隔的“语言子标记”组成)，格式在 Tags for Identifying Languages (BCP47) 中定义。xml:lang 优先于它。

## slot
将shadow DOM阴影关联树中的一个沟槽分配给一个元素：具有slot属性的元素被分配给由<slot>元素创建的沟槽，其name属性的值与slot属性的值匹配。

## title id style

## translate
枚举属性，用于指定在页面本地化时是否转换元素的属性值及其Text 节点子节点的值，或者是否保持它们不变。它可以具有以下值：
- 空字符串和"yes"，表示元素将被翻译。
- "no", 表示该元素不会被翻译。