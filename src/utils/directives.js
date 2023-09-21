import Vue from "vue";

Vue.directive("dialog", {
  bind(el) {
    const dragHeader = el.querySelector(".el-dialog__header");
    const dragDom = el.querySelector(".el-dialog");
    dragHeader.style.cursor = "move";
    let fullScreen = false;
    let historyTop;
    let historyLeft;
    let historyMarginTop;
    let historyWidth;
    let historyHeight;

    // 获取原dom css
    const sty = dragDom.CurrentStyle || window.getComputedStyle(dragDom, null);
    // 拖拽
    dragHeader.onmousedown = function (e) {
      // 获取点击位置
      const clickX = e.clientX;
      const clickY = e.clientY;
      // const dragDomLeft = dragDom.offsetLeft;
      // const dragDomTop = dragDom.offsetTop;

      // 获取到的值带px 正则匹配替换
      let styL, styT;

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes("%")) {
        styL = +document.body.clientWidth * (+sty.left.replace(/%/g, "") / 100);
        styT = +document.body.clientHeight * (+sty.top.replace(/%/g, "") / 100);
      } else {
        styL = +sty.left.replace(/\px/g, "");
        styT = +sty.top.replace(/\px/g, "");
      }

      document.onmousemove = function (e) {
        // e.clientX-click弹窗左顶点位置，
        dragDom.style.left = e.clientX - clickX + styL + "px";
        dragDom.style.top = e.clientY - clickY + styT + "px";
      };

      document.onmouseup = function () {
        document.onmouseup = null;
        document.onmousemove = null;
      };
    };
    //双击全屏
    dragHeader.ondblclick = function () {
      if (!fullScreen) {
        historyTop = dragDom.style.top;
        historyLeft = dragDom.style.left;
        historyMarginTop = dragDom.style.marginTop;
        historyWidth = dragDom.style.width;
        historyHeight = dragDom.style.height;
        dragDom.style.top = 0;
        dragDom.style.left = 0;
        dragDom.style.width = "100vw";
        dragDom.style.height = "100vh";
        dragDom.style.marginTop = 0;
        fullScreen = true;
      } else {
        fullScreen = false;
        dragDom.style.top = historyTop;
        dragDom.style.left = historyLeft;
        dragDom.style.marginTop = historyMarginTop;
        dragDom.style.width = historyWidth;
        dragDom.style.height = historyHeight;
      }
    };

    // 设置边界鼠标样式
    dragDom.onmousemove = function (e) {
      if (
        e.clientX > dragDom.clientWidth + dragDom.offsetLeft - 8 ||
        e.clientX < dragDom.offsetLeft + 8
      ) {
        dragDom.style.cursor = "w-resize";
      } else if (
        e.clientY > dragDom.offsetTop + dragDom.clientHeight - 8 ||
        e.clientY < dragDom.offsetTop + 8
      ) {
        dragDom.style.cursor = "s-resize";
      } else {
        dragDom.style.cursor = "default";
        dragDom.onmousedown = null;
      }

      dragDom.onmousedown = function (n) {
        // 不能选择到字体
        dragDom.style.userSelect = "none";
        const clientX = n.clientX;
        const clientY = n.clientY;
        const dragDomWidth = dragDom.clientWidth;
        const dragDomHeight = dragDom.clientHeight;
        const dragOffLeft = dragDom.offsetLeft;
        const dragMarginRight =
          document.querySelector(".el-dialog__wrapper").clientWidth -
          dragDom.offsetLeft -
          dragDom.clientWidth;
        const dragOffTop = dragDom.offsetTop;
        if (
          n.clientY < dragHeader.clientHeight + dragDom.offsetTop &&
          dragDom.offsetTop < n.clientY &&
          n.clientX < dragHeader.clientWidth + dragDom.offsetLeft &&
          dragDom.offsetLeft < n.clientX
        ) {
          return;
        } else {
          document.onmousemove = function (e) {
            e.preventDefault();
            const left = clientX > dragOffLeft && clientX < dragOffLeft + 8;

            if (left) {
              console.log("左");
              dragDom.style.marginRight = dragMarginRight + "px";
              if (clientX > e.clientX) {
                dragDom.style.width =
                  // 两边增加长度,会平分,所以乘2
                  dragDomWidth + (clientX - e.clientX) + "px";
              }

              if (clientX < e.clientX) {
                if (dragDom.clientWidth < 400) {
                  return;
                } else {
                  dragDom.style.width =
                    dragDomWidth + (clientX - e.clientX) + "px";
                }
              }
            }

            const right =
              clientX < dragOffLeft + dragDomWidth &&
              clientX > dragOffLeft + dragDomWidth - 8;
            if (right) {
              console.log("右");
              dragDom.style.left = dragOffLeft + "px";
              dragDom.style.left = 0;
              if (e.clientX > clientX) {
                dragDom.style.width =
                  dragDomWidth + (e.clientX - clientX) + "px";
              }
              if (e.clientX < clientX) {
                if (dragDom.clientWidth < 400) {
                  return;
                } else {
                  dragDom.style.width =
                    dragDomWidth + (e.clientX - clientX) + "px";
                }
              }
            }

            const bottom =
              clientY > dragDomHeight + dragOffTop - 8 &&
              clientY < dragDomHeight + dragOffTop;
            if (bottom) {
              if (e.clientY > clientY) {
                dragDom.style.height =
                  dragDomHeight + e.clientY - clientY + "px";
              }
            }
          };

          document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        }
      };
    };
  },
});
