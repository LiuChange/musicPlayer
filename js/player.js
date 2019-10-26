(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype={
        constructor:Player,
        musicList:[],
        init:function ($audio) {
            this.$audio=$audio;
            this.audio = $audio.get(0);
        },
        currentIndex:-1,
        playMusic:function (index,music) {
            //判断是否是同一首歌
if (this.currentIndex==index){
    //同意一首音乐
    if (this.audio.paused){
        this.audio.play();
    }else{
        this.audio.pause();
    }
}else{
    //不是同一首
    this.$audio.attr('src',music.link_url);
    this.audio.play();
    this.currentIndex=index;
}
        },
        //删除后台数据
        changeMusic:function (index) {
            this.musicList.splice(index,1);
            if (index<this.currentIndex){
                this.currentIndex--;
            }
        },
        MusicUpDate:function (callBack) {
            let $this=this;
            this.$audio.on('timeupdate',function () {
                let duration=$this.audio.duration;
                let currentTime=$this.audio.currentTime;
                let timeStr=$this.formatDate(duration,currentTime);
                let value=currentTime/duration*100;
                callBack(timeStr,currentTime, duration,value);
            });
        },
        musicSeekTo:function(value){
            this.audio.currentTime=this.audio.duration * value;
        },
        musicVoiceSeekTo:function(value){

            this.audio.volume=value;
        },
        formatDate:function (duration,currentTime) {
            let endMin=parseInt(duration / 60)<10?"0"+parseInt(duration / 60):parseInt(duration / 60);
            let endSec=parseInt(duration % 60)<10?"0"+parseInt(duration % 60):parseInt(duration % 60);
            let startMin=parseInt(currentTime / 60)<10?"0"+parseInt(currentTime / 60):parseInt(currentTime / 60);
            let startSec=parseInt(currentTime % 60)<10?"0"+parseInt(currentTime % 60):parseInt(currentTime % 60);
            return startMin+':'+startSec+'/'+endMin+':'+endSec;
        }


    }

    Player.prototype.init.prototype=Player.prototype;
window.Player=Player;


})(window);