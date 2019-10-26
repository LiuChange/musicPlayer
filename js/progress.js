(function (window) {
    function Progress($progressBar,$progressBarInner,$progressBarInnerDot) {
        return new Progress.prototype.init($progressBar,$progressBarInner,$progressBarInnerDot);
    }
    Progress.prototype={
        constructor:Progress,
        isMove:false,
        init:function ($progressBar,$progressBarInner,$progressBarInnerDot) {
 this.$progressBar=$progressBar;
 this.$progressBarInner=$progressBarInner;
 this.$progressBarInnerDot=$progressBarInnerDot;

        },
        progressClick:function (callBack) {
            let $this=this;
            //监听背景的点击
            this.$progressBar.click(function (e) {
                let normalLeft=$(this).offset().left;
                 let eLeft=e.pageX;
                 $this.$progressBarInner.css('width',eLeft-normalLeft);
                 $this.$progressBarInnerDot.css('left',eLeft-normalLeft);
                 let value=(eLeft-normalLeft)/$this.$progressBar.width();
                 callBack(value);
            });
        },
        progressMove:function (callBack) {
            let $this=this;
            //监听鼠标的按下事件
this.$progressBar.mousedown(function () {
    // $this.isMove=true;
    let normalLeft=$(this).offset().left;
    //监听鼠标的移动事件
    $(document).mousemove(function (e) {

        let eLeft=e.pageX;
        $this.$progressBarInner.css('width',eLeft-normalLeft);
        $this.$progressBarInnerDot.css('left',eLeft-normalLeft);
        let value=(eLeft-normalLeft)/$this.$progressBar.width();
        callBack(value);
    });
    });
            //监听鼠标的抬起事件
            $(document).mouseup(function () {
                $(document).off('mousemove');
                // $this.isMove=false;
});


        },
        setProgress:function (value) {
            // if (this.isMove) return;
            if (value<0||value>100)return;
            this.$progressBarInner.css({
                width:value+'%'
            });
            this.$progressBarInnerDot.css({
                left:value+'%'
            });
        },



    }

    Progress.prototype.init.prototype=Progress.prototype;
    window.Progress=Progress;


})(window);