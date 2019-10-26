$(function () {


        let $audio=$('audio');
        let player=new Player($audio);
        let progress;
        let voiceProgress;
        let lyric;






        //初始化进度条
        initProgress();
        //初始化歌词信息
        // initMusicLyric();
        //加载歌曲列表
        getPlayerList();
        //滚动条样式
        $('.music-list').mCustomScrollbar();
        //事件的点击
        initEvent();

        function initEvent() {
                //列表播放按钮
                $('.music-list>ul>.nav>.list-checkbox').click(function () {
                        if ($(this).attr('class').indexOf('list-checked') == -1) {
                                $(this).parents('.nav').siblings().find('.list-checkbox').addClass('list-checked');

                        } else {
                                $(this).parents('.nav').siblings().find('.list-checkbox').removeClass('list-checked');
                        }

                });

                //底部播放按钮点击切换

                $('.footer-toggle').click(function () {
                        $(this).toggleClass('play-btn');
                });

                //监听复选框的点击
                $('body').delegate('.list-checkbox', 'click', function () {
                        $(this).toggleClass('list-checked');
                });

                //列表中播放按钮转换
                $('body').delegate('.toggle-btn', 'click', function () {
                        let $item=$(this).parents('.one-list');
                        $(this).toggleClass('toggle-play');
                        //列表中其余播放按钮归位
                        $(this).parents('.one-list').siblings().find('.toggle-btn').removeClass('toggle-play');
                        //同步底部播放按钮
                        if ($(this).attr('class').indexOf('toggle-play') !== -1) {
                                $('.footer-toggle').removeClass('play-btn');
                                //正在播放音乐的列表字体颜色切换
                                $(this).parents('.one-list').css({
                                        color: 'white'
                                });
                                $(this).parents('.one-list').siblings().css({
                                        color: 'black'
                                });

                        } else {
                                $('.footer-toggle').addClass('play-btn');
                                $(this).parents('.one-list').css({
                                        color: 'black'
                                });
                        }
                        player.playMusic($item.get(0).index, $item.get(0).music);
                        initMusicInfo($item[0].music);
                        initMusicLyric($item[0].music);
                });

                //列表中删除按钮的点击
                $('.music-list').delegate('.delete','click',function () {
                        //找到被点击的音乐
                        let $item=$(this).parents('.one-list');
                        //判断当前删除的是否是正在播放的
                        if (player.currentIndex==$item[0].index){
                                $('#next-music').trigger('click');
                        }
                            $item.remove();
                        player.changeMusic($item.get(0).index);

                        //进行重新排序
                        $('.one-list').each(function (index, ele) {
 ele.index =index;
 $(ele).find('.num').html(index+1);
                        });
                });

                //底部控制区域播放按钮的点击
                $('.footer-toggle').click(function () {
                        //判断有没有播放过音乐
                   if (player.currentIndex==-1){
                     //没有播放过音乐
                           $('.one-list').eq(0).find('.toggle-btn').trigger('click');
                   }else{
                           //播放过音乐
                           $('.one-list').eq(player.currentIndex).find('.toggle-btn').trigger('click');
                   }
                });
                //底部控制区上一首按钮的点击
                $('.footer-last-music').click(function () {
                        if (player.currentIndex>0){
                        $('.one-list').eq(player.currentIndex-1).find('.toggle-btn').trigger('click');
                        }
                        else{
                                $('.one-list').eq(player.musicList.length-1).find('.toggle-btn').trigger('click');
                        }
                });
                //底部控制区下一首按钮的点击
                $('#next-music').click(function () {
                         if (player.currentIndex>player.musicList.length-1)
                                 $('.one-list').eq(0).find('.toggle-btn').trigger('click');
                         else{
                                $('.one-list').eq(player.currentIndex+1).find('.toggle-btn').trigger('click');
                         }
                });

                //静音按钮的点击
                $('.voice-logo').click(function () {
                   $(this).toggleClass('no-voice');
                   if ($(this).attr('class').indexOf('no-voice')!==-1){
                           //变为有声音
                           player.musicVoiceSeekTo(0);
                   }else
                   {
                           player.musicVoiceSeekTo(1);

                   }
                });


        }
        function initProgress(){
                let $progressBar=$('.progressBar');
                let $progressBarInner=$('.progress-inner');
                let $progressBarInnerDot=$('.progress-inner-dot');
                progress=new Progress($progressBar,$progressBarInner,$progressBarInnerDot);
                progress.progressClick(function (value) {
                        player.musicSeekTo(value);
                });
                progress.progressMove(function (value) {
                        player.musicSeekTo(value);
                });

                //监听播放进度
                player.MusicUpDate(function (timeStr,currentTime, duration,value) {
                        $('.progress-time').text(timeStr);
                        progress.setProgress(value);
                        let index=lyric.currentIndex(currentTime);
                        let $item=$('.lyric li').eq(index);
                        $item.addClass('current');
                        $item.siblings().removeClass('current');
                        if (index<=2) return;
                        $('.lyric').css({
                                        marginTop: (-index+2) * 30
                        });

                });


                let $voicePro=$('.voice-progress');
                let $voiceInner=$('.voice-progress-inner');
                let $voiceDot=$('.voice-progress-inner-dot');
                voiceProgress=new Progress($voicePro,$voiceInner,$voiceDot);
                voiceProgress.progressClick(function (value) {
                        player.musicVoiceSeekTo(value);
                });
                voiceProgress.progressMove(function (value) {
                        player.musicVoiceSeekTo(value);
                });
        }
        function getPlayerList() {
                $.ajax({
                        url:'./source/musiclist.json',
                        dataType:'json',
                        success:function (data) {
                                player.musicList=data;
                                $.each(data,function (index,music) {
                                        let $list=createMusicList(index, music);
                                        let $musicList=$('.music-list ul');
                                        $musicList.append($list);
                                });
                                initMusicInfo(data[0]);
                            initMusicLyric(data[0]);
                        },

                        error:function (e) {
                                console.log(e);
                        }

                });
        }
        function initMusicInfo(music) {
                let $musicImg=$('.song-info-img img');
                let $musicName=$('.song-info-name a');
                let $musicSinger=$('.song-info-singer a');
                let $musicZhuanji=$('.song-info-zhuanji a');
                let $progressName=$('.progress-name');
                let $progressTime=$('.progress-time');
                let $bgMask=$('.bg-mask');
                //给获取到的元素赋值
                $musicImg.attr('src',music.cover);
                $musicName.text(music.name);
                $musicSinger.text(music.singer);
                $musicZhuanji.text(music.album);
                $progressName.text(music.name+"/"+music.singer);
                $progressTime.text("00:00/"+music.time);
                $bgMask.css({background:"url('"+music.cover+"')"});
        }
        //初始化歌词信息
        function initMusicLyric(music) {
            lyric=new Lyric(music.link_lrc);
            let $lryMusicContent=$('.lyric');
            //清空上一首歌曲列表
            $lryMusicContent.html('');
            lyric.loadLyric(function () {
                //创建歌词列表
                $.each(lyric.lyrics,function (index, ele) {
                    let $item=$('<li>'+ele+'</li>');
                    $lryMusicContent.append($item);

                });
            });

        }
        function createMusicList(index,music) {
                let $item=$("<li class='one-list'><div class=\"list-checkbox\"></div>\n" +
                    "<div class=\"list-name\"><span class='num'>"+(index+1)+"</span><span>"+music.name+"</span>"+
                    "<div class=\"btn fr clearfix\">\n" +
                    "<span class='toggle-btn'></span>\n" +
                    "<span></span>\n" +
                    "<span></span>\n" +
                    "<span></span>\n" +
                    "</div></div>\n" +
                    "<div class=\"list-author fr clearfix\"><a href=\"javascript;\">"+music.singer+"</a></div><div class=\"list-time fr clearfix\"><span class=\"time\" >"+music.time+"</span><span class=\"delete\"></span></div></li>");
                $item.get(0).index =index;
                $item.get(0).music = music;
                return $item;

        }



});



