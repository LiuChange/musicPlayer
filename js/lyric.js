(function (window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype={
        constructor:Lyric,

        index:-1,
        times:[],
        lyrics:[],

        init:function (path) {
           this.path=path;
        },

        loadLyric:function (callBack) {
            let $this=this;
            $.ajax({
                url:$this.path,
                dataType:'text',
                success:function (data) {
                $this.parseLyric(data);
                callBack();
                },
                error:function (e) {
                    console.log(e);
                }

            });
        },
        parseLyric:function (data) {
            let $this=this;
            $this.time=[],
                $this.lyrics=[];
            let array=data.split('\n');
            let timeReg=/\[(\d*:\d*\.\d*)\]/;
            $.each(array, function (index,ele) {


                let lrc=ele.split(']')[1];
                //排除没有歌词
                if (lrc.length==1) return true;
                $this.lyrics.push(lrc);


                let res=timeReg.exec(ele);
                if (res==null) return true;
                let timeStr=res[1];
                let res2=timeStr.split(':');
                let min=parseInt(res2[0])*60;
                let sec=parseFloat(res2[1]);
                let time=parseFloat(Number(min+sec).toFixed(2));
                $this.times.push(time);

            });
        },
        currentIndex:function (currentTime) {
            if (currentTime>=this.times[0]){
                this.index++;
                this.times.shift();//删除元素最前面的一个元素
            }
            return this.index;
        }



    }

    Lyric.prototype.init.prototype=Lyric.prototype;
    window.Lyric=Lyric;


})(window);