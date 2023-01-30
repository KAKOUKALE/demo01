// 作用：需要将所有的DOM元素对象以及相关的资源全部都加载完毕之后，再来实现的事件函数
window.onload = function () {

    // 获取imagessrc数据
    var imagessrc = goodData.imagessrc

    // 声明一个记录点击的缩略图下标
    var bigImgIndex = 0
    // 路径导航的数据渲染
    navPathDataBind()
    function navPathDataBind() {

        // 获取页面元素
        let navPath = document.querySelector('#wrapper #content .contentMain .navPath')
        // 获取数据
        let path = goodData.path
        // 遍历数据
        for (let i = 0; i < path.length; i++) {
            if (i == path.length - 1) {
                let aNode = document.createElement('a')
                aNode.innerText = path[i].title
                navPath.appendChild(aNode)
            } else {
                // 创建a标签
                let aNode = document.createElement('a')
                aNode.href = path[i].url
                aNode.innerText = path[i].title
                // console.log(aNode)
                // 创建span标签
                spanNode = document.createElement('span')
                spanNode.innerText = '/'
                // 将span标签追加到a标签
                aNode.appendChild(spanNode)
                navPath.appendChild(aNode)
            }

        }
    }

    // 放大镜的移入、移除效果
    bigImgBind()
    function bigImgBind() {
        // 1.获取小图框元素对象，并设置移入事件（onmouseover？onmouseenter---是否需要冒泡【选后者】）
        // 2.动态创建蒙版元素以及大图框和大图片元素
        // 3.移出时需要移除蒙版元素和大图框

        let leftTop = document.querySelector('#wrapper #center .left .leftTop')
        // 获取小图框元素
        let smallPic = document.querySelector('#wrapper #center .left .leftTop .smallPic')
        // 设置移入事件
        smallPic.onmouseenter = function () {
            // 小测试，查看是否获取到对应元素
            // alert('mouseenter!!!')

            // 创建蒙版元素
            let maskDiv = document.createElement('div')
            maskDiv.className = 'mask'

            // 创建大图框元素
            let bigDiv = document.createElement('div')
            bigDiv.className = 'bigPic'

            // 创建大图片元素
            let bigImg = document.createElement('img')
            bigImg.src = imagessrc[bigImgIndex].b

            bigDiv.appendChild(bigImg)
            smallPic.appendChild(maskDiv)

            leftTop.appendChild(bigDiv)

            // 设置移动事件
            smallPic.onmousemove = function (event) {
                // event.clientX:鼠标距离浏览器左侧X轴的距离
                // getBoundingClientRect():返回的是一个对象，getBoundingClientRect().left小图框元素距离浏览器左侧可视left值
                // offsetWidth:元素是占位宽度
                let left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2;
                let top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2;

                if (left < 0) {
                    left = 0
                } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
                    left = smallPic.clientWidth - maskDiv.offsetWidth
                }
                if (top < 0) {
                    top = 0
                } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
                    top = smallPic.clientHeight - maskDiv.offsetHeight
                }
                maskDiv.style.left = left + 'px'
                maskDiv.style.top = top + 'px'

                // 移动比例关系 = 蒙版元素移动的距离 - 大图片元素移动的距离
                let scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (bigImg.clientWidth - bigDiv.offsetWidth)
                // console.log(scale)

                bigImg.style.left = - left / scale + 'px'
                bigImg.style.top = - top / scale + 'px'
            }

            // 设置移出事件
            smallPic.onmouseleave = function () {
                // 小图标移除蒙版元素
                smallPic.removeChild(maskDiv)
                // leftTop移除大图框
                leftTop.removeChild(bigDiv)
            }
        }
    }

    // 动态渲染放大镜缩略图的数据
    thumbnailData()
    function thumbnailData() {
        // 1.获取piclist元素下的ul
        // 2.在获取data.js文件下的goodData->imagessrc
        // 3.遍历数组，根据数组的长度来创建li元素

        // 获取piclist元素下的ul
        let ul = document.querySelector('#wrapper #center .left .leftBottom .piclist ul')
        // console.log(ul)
        // 获取data.js文件下的数据
        // let imagessrc = goodData.imagessrc
        // console.log(imgs)
        // 遍历数组，创建li
        for (let i = 0; i < imagessrc.length; i++) {
            let li = document.createElement('li')
            let img = document.createElement('img')
            img.src = imagessrc[i].s

            // 元素追加
            li.appendChild(img)
            ul.appendChild(li)
        }
    }

    // 点击缩略图的效果
    thumbnailClick()
    function thumbnailClick() {
        // 1.获取所有li元素，并且循环发生点击事件
        // 2.点击缩略图需要确定其下标位置找到对应小图路径和大图路径替换现有src的值

        // 获取所有li元素
        let lis = document.querySelectorAll('#wrapper #center .left .leftBottom .piclist ul li')
        // console.log(lis)

        // 获取小图框中的小图片元素
        let smallPicImg = document.querySelector('#wrapper #center .left .leftTop .smallPic img')

        // 小图片路径需要默认和imagessrc的第一个元素小图的路径是一致的
        smallPicImg.src = imagessrc[0].s

        // 循环点击这些li元素
        for (let i = 0; i < lis.length; i++) {
            lis[i].onclick = function () {
                bigImgIndex = i

                //变换小图片
                smallPicImg.src = imagessrc[bigImgIndex].s
            }
        }
    }

    // 点击缩略图左右箭头的效果
    thumbnailLeftRightClick()
    function thumbnailLeftRightClick() {
        // 1.获取左右两端箭头按钮
        // 2.在获取可视div以及ul元素和所有的li元素
        // 3.计算（发生起点、步长、总体运动的距离值）
        // 4.然后再发生点击事件

        // 获取左右两端箭头按钮
        let arrows = document.querySelectorAll('#wrapper #center .left .leftBottom a')
        let left = arrows[0]
        let right = arrows[1]

        // 获取div以及ul和所有的li元素
        let ul = document.querySelector('#wrapper #center .left .leftBottom .piclist ul')
        let lis = document.querySelectorAll('#wrapper #center .left .leftBottom .piclist ul li')

        // 计算
        let start = 0
        let step = (lis[0].offsetWidth + 20) * 2
        let endPosition = (lis.length - 5) * (lis[0].offsetWidth + 20)

        // 点击事件
        left.onclick = function () {
            start -= step
            if (start < 0) {
                start = 0
            }
            ul.style.left = -start + 'px'
        }
        right.onclick = function () {
            start += step
            if (start > endPosition) {
                start = endPosition
            }
            ul.style.left = -start + 'px'
        }

    }

    // 商品详情数据的动态渲染
    rightTopData()
    function rightTopData() {
        // 1.获取rightTop元素
        // 2.获取dada.js中的数据
        // 3.建立一个字符串变量，将原来的布局结构贴进来，将所对应的数据放在对应的位置上重新渲染rightTop元素

        // 获取rightTop元素
        let rightTop = document.querySelector('#wrapper #center .right .rightTop')
        // console.log(rightTop)

        // 获取动态数据
        let goodsDetails = goodData.goodsDetail
        // console.log(goodsDetails)

        // 将原来的布局结构贴进来
        rightTop.innerHTML = `
                <h3>${goodsDetails.title}</h3>
                <p>${goodsDetails.recommend}</p>
                <div class="priceWrap">
                    <div class="priceTop">
                        <span>价&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;格</span>
                        <div class="price">
                            <span>￥</span>
                            <p>${goodsDetails.price}</p>
                            <i>降价通知</i>
                        </div>
                        <p>
                            <span>累计评价</span>
                            <span>${goodsDetails.evaluateNum}</span>
                        </p>
                    </div>
                    <div class="priceBottom">
                        <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                        <p>
                            <span>${goodsDetails.promoteSales.type}</span>
                            <span>${goodsDetails.promoteSales.content}</span>
                        </p>
                    </div>
                </div>
                <div class="support">
                    <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
                    <p>${goodsDetails.support}</p>
                </div>
                <div class="address">
                    <span>配&nbsp;送&nbsp;至</span>
                    <p>${goodsDetails.address}</p>
                </div>`
    }

    // 商品参数数据的动态渲染
    rightBottomData()
    function rightBottomData() {
        // 1.获取rightBottom元素
        // 2.获取data.js数据
        // 3.由于数据是一个数组，需要遍历，有一个元素则需要有一个动态的dl元素对象

        // 获取chooseWrap元素
        let chooseWrap = document.querySelector('#wrapper #center .right .rightBottom .chooseWrap')

        // 获取data.js数据
        let crumbData = goodData.goodsDetail.crumbData
        // console.log(crumbData)

        // 遍历获取到的crumbData数据
        for (let i = 0; i < crumbData.length; i++) {
            // 创建dl、dt元素
            let dl = document.createElement('dl')
            let dt = document.createElement('dt')

            dt.innerText = crumbData[i].title
            dl.appendChild(dt)
            for (let j = 0; j < crumbData[i].data.length; j++) {
                // 创建dd
                let dd = document.createElement('dd')
                dd.innerText = crumbData[i].data[j].type
                dd.setAttribute('price', crumbData[i].data[j].changePrice)
                dl.appendChild(dd)
            }
            chooseWrap.appendChild(dl)
        }
    }

    // 点击商品参数之后的颜色排他效果
    clickddBind()
    function clickddBind() {

        // 1.获取所有的dl元素
        // 2.循环所有dd元素并且添加点击事件
        // 3.确定实际发生事件的目标源对象设置其文字颜色为红色，然后给其他所有的元素颜色都重置为基础颜色（#666）
        // ************************
        // 点击所有dd元素之后产生的mark标记
        // 1.首先创建一个可以容纳点击的dd元素值的容器（数组），确定数组的长度
        // 2.然后再将点击的dd元素的值按照对应下标来写到数组的元素身上

        // 获取所有dl元素
        let dls = document.querySelectorAll('#wrapper #center .right .rightBottom .chooseWrap dl')
        // console.log(dls)

        // 创建一个数组容器
        let arr = new Array(dls.length)
        arr.fill(0)

        // 获取选择之后结果的元素choose
        let choose = document.querySelector('#wrapper #center .right .rightBottom .choose')
        // console.log(choose)
        for (let i = 0; i < dls.length; i++) {
            // console.log(dls[i])
            let dds = dls[i].querySelectorAll('dd')
            // console.log(dds)
            // 循环所有dd元素并添加点击事件
            for (let j = 0; j < dds.length; j++) {
                dds[j].onclick = function () {
                    choose.innerHTML = ''

                    // console.log(dds[j])
                    for (let x = 0; x < dds.length; x++) {
                        dds[x].style.color = '#666'
                    }
                    dds[j].style.color = 'red'

                    arr[i] = dds[j]

                    changePriceBind(arr)

                    arr.forEach(function (value, index) {
                        if (value) {
                            let mark = document.createElement('div')
                            mark.innerText = value.innerText
                            mark.className = 'mark'
                            let a = document.createElement('a')
                            a.innerText = 'X'
                            a.setAttribute('index', index)
                            a.className = 'a'
                            mark.appendChild(a)
                            choose.appendChild(mark)
                        }
                    })

                    // 获取a标签并循环添加点击事件
                    // 点击X后
                    let as = document.querySelectorAll('#wrapper #center .right .rightBottom .choose .mark a')
                    // console.log(as)
                    for (let m = 0; m < as.length; m++) {

                        as[m].onclick = function () {
                            let inx = as[m].getAttribute('index')
                            arr[inx] = 0

                            // 获取对应的a下标
                            // console.log(inx)

                            // 找到对应的dl并修改对应dd的样式
                            let ddNodes = dls[inx].querySelectorAll('dd')
                            for (let n = 0; n < ddNodes.length; n++) {
                                ddNodes[n].style.color = '#666'
                            }
                            ddNodes[0].style.color = 'red'

                            choose.removeChild(as[m].parentNode)

                            changePriceBind(arr)

                        }
                    }

                }
            }
        }
    }

    // 价格变动函数声明
    /**
     * 这个函数是需要在点击dd的时候以及删除mark标记的时候才需要调用
     */
    // changePriceBind()
    function changePriceBind(arr) {
        /**
         * 1.获取价格的标签元素
         * 2.给每一个dd标签上都默认设置一个自定义的属性，用来记录价格的变化
         * 3.遍历arr数组，将dd元素身上的新变化的价格和已有的价格相加
         * 4.最后将计算之后的结果重新渲染到p标签中
         */

        // 获取价格的标签元素
        let oldPrice = document.querySelector('#wrapper #center .right .rightTop .priceWrap .priceTop .price p')
        // console.log(price)
        let basePrice = document.querySelector('#wrapper .goodsDetailWrap .rightDetail .chooseBox .listWrap .left > p')

        let totalPtice = document.querySelector('#wrapper .goodsDetailWrap .rightDetail .chooseBox .listWrap .right > i')

        // 遍历arr数组
        let addPrice = 0
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                // console.log(addPrice)
                // console.log(arr[i])
                addPrice += Number(arr[i].getAttribute('price'))
                // console.log(addPrice)
            }

        }
        // console.log(addPrice)
        let newPrice = addPrice + Number(goodData.goodsDetail.price)
        // console.log(newPrice)
        oldPrice.innerText = newPrice

        basePrice.innerText = '￥' + oldPrice.innerText

        totalPtice.innerText = basePrice.innerText

    }

    // 选择搭配中间区域复选框选中套餐价格变动效果
    chooseprice()
    function chooseprice() {
        /**
         * 1.获取中间区域中所有的复选框元素
         * 2.遍历这些元素取出他们的价格，和左侧的基础价格进行累加，累加之后重新写回套餐价格标签里面
         * 
         * 【套餐价格应该与商品选择区域的价格相对应】
         */

        let basePrice = document.querySelector('#wrapper .goodsDetailWrap .rightDetail .chooseBox .listWrap .left > p')
        // console.log(basePrice)
        let totalPtice = document.querySelector('#wrapper .goodsDetailWrap .rightDetail .chooseBox .listWrap .right > i')
        // 获取复选框
        let checkboxs = document.querySelectorAll('#wrapper .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input')
        // console.log(checkboxs)

        // basePrice的价格应该和上面个选择区域对应

        // 遍历复选框
        for (let i = 0; i < checkboxs.length; i++) {
            checkboxs[i].onclick = function () {
                let oldPrice = Number(basePrice.innerText.slice(1))
                for (let j = 0; j < checkboxs.length; j++) {
                    if (checkboxs[j].checked) {
                        oldPrice = oldPrice + Number(checkboxs[j].value)
                    }
                }

                totalPtice.innerText = '￥' + oldPrice
            }
        }
    }

    // 封装一个公共的选项卡函数

    /**
     * 1.被点击的元素       tabButns
     * 2.被切换显示的元素    tabConts
     */

    function Tab(tabButns, tabConts) {
        for (let i = 0; i < tabButns.length; i++) {
            tabButns[i].onclick = function () {
                for (let j = 0; j < tabButns.length; j++) {
                    tabButns[j].className = ''
                    tabConts[j].className = ''

                }
                tabButns[i].className = 'active'
                tabConts[i].className = 'active'
            }
        }
    }

    // 点击左侧选项卡
    leftTab()
    function leftTab() {
        /**
         * 1.获取点击元素和被切换显示的元素
         * 2.调用公共选项卡函数并传入实参
         */

        let tabButns = document.querySelectorAll('#wrapper .goodsDetailWrap .leftAside .asideTop h4')
        let tabConts = document.querySelectorAll('#wrapper .goodsDetailWrap .leftAside .asideContent > div')

        Tab(tabButns, tabConts)
    }

    // 点击右侧选项卡
    rightTab()
    function rightTab() {
        let tabButns = document.querySelectorAll('#wrapper .goodsDetailWrap .rightDetail .bottomDetail .tabBtns li')
        let tabConts = document.querySelectorAll('#wrapper .goodsDetailWrap .rightDetail .bottomDetail .tabContents div')
        // console.log(tabButns)
        // console.log(tabConts)
        Tab(tabButns, tabConts)
    }

    // 右边侧边栏的点击效果
    rightAsideBind()
    function rightAsideBind() {
        /**
         * 1.获取按钮元素，绑定点击事件
         * 2.记录一个初始状态，在点击事件的内容进行判断，如果关闭则展开，否则为关闭
         * 
         */
        let btn = document.querySelector('#wrapper .rightAside .btns')

        let rightAside = document.querySelector('#wrapper .rightAside')
        let flag = true

        btn.onclick = function () {
            if (flag) {
                btn.className = 'btns btnsOpen'
                rightAside.className = 'rightAside asideOpen'
            } else {
                btn.className = 'btns btnsClose'
                rightAside.className = 'rightAside asideClose'
            }
            flag = !flag
        }
    }


}