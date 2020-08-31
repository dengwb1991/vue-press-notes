# client、offset、scroll

## client

1. **clientWidth**: 获取网页可视区域的宽度，计算方式：`width` + `padding（left、right）`

2. **clientHeight**: 获取网页可视区域的高度，计算方式：`width` + `padding（top、bottom）`

3. **clientX**: 鼠标距离可视区域左侧的距离

4. **clientY**: 鼠标距离可视区域上侧的距离

5. **clientTop**: 盒子的上 `border`

6. **clientLeft**: 盒子的左 `border`

## offset

1. **offsetWidth**: 元素自身的宽度(含border)，计算方式：`width` + `padding（left、right）`+ `border（left、right）`

2. **offsetHeight**: 元素自身的高度(含border)，计算方式：`width` + `padding（top、bottom）`+ `border（top、bottom）`

3. **offsetLeft**: 距离父盒子中带有定位的左侧距离

4. **offsetTop**: 距离父盒子中带有定位的顶部距离

5. **offsetParent**: 当前元素的父级参照物

## scroll

1. **scrollWidth**: 内容没有溢出：元素自身的宽度(不含border)；内容溢出： `autoWidth` + `padding-left`

2. **scrollHeight**: 内容没有溢出：元素自身的高度(不含border)；内容溢出： `autoHeight` + `padding-top`

3. **scrolltLeft**: 被卷去的左侧的宽度

4. **scrolltTop**: 被卷曲的顶部的宽度