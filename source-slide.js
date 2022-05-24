<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.0/jquery.min.js"></script>
<style type="text/css">
/*Make sure your page contains a valid doctype at the top*/      
#simplegallery1{ //CSS for Simple Gallery Example 1       
position: relative; /*keep this intact*/       
visibility: hidden; /*keep this intact*/       
border: 1px solid #666;       
}
#simplegallery1 .gallerydesctext{ //CSS for description DIV of Example 1 (if defined)      
text-align: left;       
padding: 2px 5px;       
font: 10px normal verdana, arial;       
}
</style>
<script type="text/javascript" >
var simpleGallery_navpanel={      
    loadinggif: 'http://1.bp.blogspot.com/-BsjA3MieZ7k/UTlaan0EHxI/AAAAAAAABU4/us8tcy9jZ_g/s1600/ajaxload-namkna-blogspot-com.png', //full path or URL to loading gif image       
    panel: {height:'45px', opacity:0.5, paddingTop:'5px', fontStyle:'bold 11px Verdana'}, //customize nav panel container       
    images: [ 'http://3.bp.blogspot.com/-1LcVkgcbdcI/UTlars2S5WI/AAAAAAAABVA/L4raw_p0lyg/s1600/left-namkna-blogspot-com.png', 'http://3.bp.blogspot.com/-3sF6qwI8AAI/UTla5C5N7uI/AAAAAAAABVI/eMlsH8W3nos/s1600/play-namkna-blogspot-com.png', 'http://3.bp.blogspot.com/-gaWk39UdME4/UTlbDWSg7mI/AAAAAAAABVQ/fwGGZX3rCck/s1600/right-namkna-blogspot-com.png', 'http://2.bp.blogspot.com/-EhlntKAX_Gs/UTlbMnxguZI/AAAAAAAABVY/Rj-f_UHztDM/s1600/pause-namklna-blogspot-com.png'], //nav panel images (in that order)       
    imageSpacing: {offsetTop:[-4, 0, -4], spacing:10}, //top offset of left, play, and right images, PLUS spacing between the 3 images       
    slideduration: 500 //duration of slide up animation to reveal panel       
}
function simpleGallery(settingarg){      
    this.setting=settingarg       
    settingarg=null       
    var setting=this.setting       
    setting.panelheight=(parseInt(setting.navpanelheight)>5)? parseInt(setting.navpanelheight) : parseInt(simpleGallery_navpanel.panel.height)       
    setting.fadeduration=parseInt(setting.fadeduration)       
    setting.curimage=(setting.persist)? simpleGallery.routines.getCookie("gallery-"+setting.wrapperid) : 0       
    setting.curimage=setting.curimage || 0 //account for curimage being null if cookie is empty       
    setting.preloadfirst=(!jQuery.Deferred)? false : (typeof setting.preloadfirst!="undefined")? setting.preloadfirst : true //Boolean on whether to preload all images before showing gallery       
    setting.ispaused=!setting.autoplay[0] //ispaused reflects current state of gallery, autoplay[0] indicates whether gallery is set to auto play       
    setting.currentstep=0 //keep track of # of slides slideshow has gone through       
    setting.totalsteps=setting.imagearray.length*setting.autoplay[2] //Total steps limit: # of images x # of user specified cycles       
    setting.fglayer=0, setting.bglayer=1 //index of active and background layer (switches after each change of slide)       
    setting.oninit=setting.oninit || function(){}       
    setting.onslide=setting.onslide || function(){}       
    var preloadimages=[], longestdesc=null, loadedimages=0       
    var dfd = (setting.preloadfirst)? jQuery.Deferred() : {resolve:function(){}, done:function(f){f()}} //create real deferred object unless preloadfirst setting is false or browser doesn't support it       
    setting.longestdesc="" //get longest description of all slides. If no desciptions defined, variable contains ""       
    setting.$loadinggif=(function(){ //preload and ref ajax loading gif       
        var loadgif=new Image()       
        loadgif.src=simpleGallery_navpanel.loadinggif       
        return jQuery(loadgif).css({verticalAlign:'middle'}).wrap('<div style="position:absolute;text-align:center;width:100%;height:100%" />').parent()       
    })()       
    for (var i=0; i<setting.imagearray.length; i++){  //preload slideshow images       
        preloadimages[i]=new Image()       
        preloadimages[i].src=setting.imagearray[i][0]       
        if (setting.imagearray[i][3] && setting.imagearray[i][3].length>setting.longestdesc.length)       
            setting.longestdesc=setting.imagearray[i][3]       
        jQuery(preloadimages[i]).bind('load error', function(){       
            loadedimages++       
            if (loadedimages==setting.imagearray.length){       
                dfd.resolve() //indicate all images have been loaded       
            }       
        })       
    }       
    var slideshow=this       
    jQuery(document).ready(function($){       
        var setting=slideshow.setting       
        setting.$wrapperdiv=$('#'+setting.wrapperid).css({position:'relative', visibility:'visible', background:'black', overflow:'hidden', width:setting.dimensions[0], height:setting.dimensions[1]}).empty() //main gallery DIV       
        if (setting.$wrapperdiv.length==0){ //if no wrapper DIV found       
            alert("Error: DIV with ID \""+setting.wrapperid+"\" not found on page.")       
            return       
        }       
        setting.$gallerylayers=$('<div class="gallerylayer"></div><div class="gallerylayer"></div>') //two stacked DIVs to display the actual slide       
            .css({position:'absolute', left:0, top:0})       
            .appendTo(setting.$wrapperdiv)       
        setting.$loadinggif.css({top:setting.dimensions[1]/2-30}).appendTo(setting.$wrapperdiv) //30 is assumed height of ajax loading gif       
        setting.gallerylayers=setting.$gallerylayers.get() //cache stacked DIVs as DOM objects       
        setting.navbuttons=simpleGallery.routines.addnavpanel(setting) //get 4 nav buttons DIVs as DOM objects       
        if (setting.longestdesc!="") //if at least one slide contains a description (feature is enabled)       
            setting.descdiv=simpleGallery.routines.adddescpanel(setting)       
        $(setting.navbuttons).filter('img.navimages').css({opacity:0.8})       
            .bind('mouseover mouseout', function(e){       
                $(this).css({opacity:(e.type=="mouseover")? 1 : 0.8})       
            })       
            .bind('click', function(e){       
                var keyword=e.target.title.toLowerCase()       
                slideshow.navigate(keyword) //assign behavior to nav images       
            })       
        dfd.done(function(){ //execute when all images have loaded       
            setting.$loadinggif.remove()       
            setting.$wrapperdiv.bind('mouseenter', function(){slideshow.showhidenavpanel('show')})       
            setting.$wrapperdiv.bind('mouseleave', function(){slideshow.showhidenavpanel('hide')})       
            slideshow.showslide(setting.curimage) //show initial slide       
            setting.oninit.call(slideshow) //trigger oninit() event       
            $(window).bind('unload', function(){ //clean up and persist       
                $(slideshow.setting.navbuttons).unbind()       
                if (slideshow.setting.persist) //remember last shown image's index       
                    simpleGallery.routines.setCookie("gallery-"+setting.wrapperid, setting.curimage)       
                jQuery.each(slideshow.setting, function(k){       
                    if (slideshow.setting[k] instanceof Array){       
                        for (var i=0; i<slideshow.setting[k].length; i++){       
                            if (slideshow.setting[k][i].tagName=="DIV") //catches 2 gallerylayer divs, gallerystatus div       
                                slideshow.setting[k][i].innerHTML=null       
                            slideshow.setting[k][i]=null       
                        }       
                    }       
                    if (slideshow.setting[k].innerHTML) //catch gallerydesctext div       
                        slideshow.setting[k].innerHTML=null       
                    slideshow.setting[k]=null       
                })       
                slideshow=slideshow.setting=null       
            })       
        }) //end deferred code       
    }) //end jQuery domload       
}
simpleGallery.prototype={
    navigate:function(keyword){      
        clearTimeout(this.setting.playtimer)       
        this.setting.totalsteps=100000 //if any of the nav buttons are clicked on, set totalsteps limit to an "unreachable" number       
        if (!isNaN(parseInt(keyword))){       
            this.showslide(parseInt(keyword))       
        }       
        else if (/(prev)|(next)/i.test(keyword)){       
            this.showslide(keyword.toLowerCase())       
        }       
        else{ //if play|pause button       
            var slideshow=this       
            var $playbutton=$(this.setting.navbuttons).eq(1)       
            if (!this.setting.ispaused){ //if pause Gallery       
                this.setting.autoplay[0]=false       
                $playbutton.attr({title:'Play', src:simpleGallery_navpanel.images[1]})       
            }       
            else if (this.setting.ispaused){ //if play Gallery       
                this.setting.autoplay[0]=true       
                this.setting.playtimer=setTimeout(function(){slideshow.showslide('next')}, this.setting.autoplay[1])       
                $playbutton.attr({title:'Pause', src:simpleGallery_navpanel.images[3]})       
            }       
            slideshow.setting.ispaused=!slideshow.setting.ispaused       
        }       
    },
    showslide:function(keyword){      
        var slideshow=this       
        var setting=slideshow.setting       
        var totalimages=setting.imagearray.length       
        var imgindex=(keyword=="next")? (setting.curimage<totalimages-1? setting.curimage+1 : 0)       
            : (keyword=="prev")? (setting.curimage>0? setting.curimage-1 : totalimages-1)       
            : Math.min(keyword, totalimages-1)       
        setting.gallerylayers[setting.bglayer].innerHTML=simpleGallery.routines.getSlideHTML(setting.imagearray[imgindex])       
        setting.$gallerylayers.eq(setting.bglayer).css({zIndex:1000, opacity:0}) //background layer becomes foreground       
            .stop().css({opacity:0}).animate({opacity:1}, setting.fadeduration, function(){ //Callback function after fade animation is complete:       
                clearTimeout(setting.playtimer)       
                setting.gallerylayers[setting.bglayer].innerHTML=null  //empty bglayer (previously fglayer before setting.fglayer=setting.bglayer was set below)       
                try{       
                    setting.onslide.call(slideshow, setting.gallerylayers[setting.fglayer], setting.curimage)       
                }catch(e){       
                    alert("Simple Controls Gallery: An error has occured somwhere in your code attached to the \"onslide\" event: "+e)       
                }       
                setting.currentstep+=1       
                if (setting.autoplay[0]){       
                    if (setting.currentstep<=setting.totalsteps)       
                        setting.playtimer=setTimeout(function(){slideshow.showslide('next')}, setting.autoplay[1])       
                    else       
                        slideshow.navigate("play/pause")       
                }       
            }) //end callback function       
        setting.gallerylayers[setting.fglayer].style.zIndex=999 //foreground layer becomes background       
        setting.fglayer=setting.bglayer       
        setting.bglayer=(setting.bglayer==0)? 1 : 0       
        setting.curimage=imgindex       
        setting.navbuttons[3].innerHTML=(setting.curimage+1) + '/' + setting.imagearray.length       
        if (setting.imagearray[imgindex][3]){ //if this slide contains a description       
            setting.$descpanel.css({visibility:'visible'})       
            setting.descdiv.innerHTML=setting.imagearray[imgindex][3]       
        }       
        else if (setting.longestdesc!=""){ //if at least one slide contains a description (feature is enabled)       
            setting.descdiv.innerHTML=null       
            setting.$descpanel.css({visibility:'hidden'})
        }      
    },
    showhidenavpanel:function(state){      
        var setting=this.setting       
        var endpoint=(state=="show")? setting.dimensions[1]-setting.panelheight : this.setting.dimensions[1]       
        setting.$navpanel.stop().animate({top:endpoint}, simpleGallery_navpanel.slideduration)       
        if (setting.longestdesc!="") //if at least one slide contains a description (feature is enabled)       
            this.showhidedescpanel(state)       
    },
    showhidedescpanel:function(state){      
        var setting=this.setting       
        var endpoint=(state=="show")? 0 : -setting.descpanelheight       
        setting.$descpanel.stop().animate({top:endpoint}, simpleGallery_navpanel.slideduration)       
    }       
}
simpleGallery.routines={
    getSlideHTML:function(imgelement){      
        var layerHTML=(imgelement[1])? '<a href="'+imgelement[1]+'" target="'+imgelement[2]+'">\n' : '' //hyperlink slide?       
        layerHTML+='<img src="'+imgelement[0]+'" style="border-width:0" />'       
        layerHTML+=(imgelement[1])? '</a>' : ''       
        return layerHTML //return HTML for this layer       
    },
    addnavpanel:function(setting){      
        var interfaceHTML=''       
        for (var i=0; i<3; i++){       
            var imgstyle='position:relative; border:0; cursor:hand; cursor:pointer; top:'+simpleGallery_navpanel.imageSpacing.offsetTop[i]+'px; margin-right:'+(i!=2? simpleGallery_navpanel.imageSpacing.spacing+'px' : 0)       
            var title=(i==0? 'Prev' : (i==1)? (setting.ispaused? 'Play' : 'Pause') : 'Next')       
            var imagesrc=(i==1)? simpleGallery_navpanel.images[(setting.ispaused)? 1 : 3] : simpleGallery_navpanel.images[i]       
            interfaceHTML+='<img class="navimages" title="' + title + '" src="'+ imagesrc +'" style="'+imgstyle+'" /> '       
        }       
        interfaceHTML+='<div class="gallerystatus" style="margin-top:1px">' + (setting.curimage+1) + '/' + setting.imagearray.length + '</div>'       
        setting.$navpanel=$('<div class="navpanellayer"></div>')       
            .css({position:'absolute', width:'100%', height:setting.panelheight, left:0, top:setting.dimensions[1], font:simpleGallery_navpanel.panel.fontStyle, zIndex:'1001'})       
            .appendTo(setting.$wrapperdiv)       
        $('<div class="navpanelbg"></div><div class="navpanelfg"></div>') //create inner nav panel DIVs       
            .css({position:'absolute', left:0, top:0, width:'100%', height:'100%'})       
            .eq(0).css({background:'black', opacity:simpleGallery_navpanel.panel.opacity}).end() //"navpanelbg" div       
            .eq(1).css({paddingTop:simpleGallery_navpanel.panel.paddingTop, textAlign:'center', color:'white'}).html(interfaceHTML).end() //"navpanelfg" div       
            .appendTo(setting.$navpanel)       
        return setting.$navpanel.find('img.navimages, div.gallerystatus').get() //return 4 nav related images and DIVs as DOM objects       
    },
    adddescpanel:function(setting){      
        setting.$descpanel=$('<div class="gallerydesc"><div class="gallerydescbg"></div><div class="gallerydescfg"><div class="gallerydesctext"></div></div></div>')       
            .css({position:'absolute', width:'100%', left:0, top:-1000, zIndex:'1001'})       
            .find('div').css({position:'absolute', left:0, top:0, width:'100%'})       
            .eq(0).css({background:'black', opacity:simpleGallery_navpanel.panel.opacity}).end() //"gallerydescbg" div       
            .eq(1).css({color:'white'}).end() //"gallerydescfg" div       
            .eq(2).html(setting.longestdesc).end().end()       
            .appendTo(setting.$wrapperdiv)       
        var $gallerydesctext=setting.$descpanel.find('div.gallerydesctext')       
        setting.descpanelheight=$gallerydesctext.outerHeight()       
        setting.$descpanel.css({top:-setting.descpanelheight, height:setting.descpanelheight}).find('div').css({height:'100%'})       
        return setting.$descpanel.find('div.gallerydesctext').get(0) //return gallery description DIV as a DOM object       
    },
    getCookie:function(Name){      
        var re=new RegExp(Name+"=[^;]+", "i"); //construct RE to search for target name/value pair       
        if (document.cookie.match(re)) //if cookie found       
            return document.cookie.match(re)[0].split("=")[1] //return its value       
        return null       
    },
    setCookie:function(name, value){      
        document.cookie = name+"=" + value + ";path=/"       
    }       
}
</script>
<script type="text/javascript">
var mygallery=new simpleGallery({      
    wrapperid: "simplegallery1", //ID of main gallery container,       
    dimensions: [300, 200], //width/height of gallery in pixels. Should reflect dimensions of the images exactly       
    imagearray: [       
        ["https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgiyzdOOHF4UHiPub551g6f_E_uewEgY3K9SIJRbA0HbtVROobaFaTT1W2zWWPLZjsP-FCuSCLq0RGT1Out74j92Uyg_BBfgR_X8q1JE3Ybisg92TlAG3NbpMFqqg_hYyKdQ_pESDwDY4GqX0cCgt3d4zizN3alek4bL-vY85LUXaw2rksEHPaV1-ypwA/s1280/1.jpg", "#", "_new", "DESCRIPTION"],
        ["https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiZbrwAT5p_suoRNgM_-2HnUp_jvRgNM2umaONMqE3uCW6p_q-8QgQv90RA6sHJqrjP5PK-3WH-01H-LB6yF_0CQ_HaPjmlchaENCwOpvFbHzTZ1JjMUkrFiglTrajLz8QUzAc28-vArjLZxHWcwGOFx7YDtGzCxl2E224XaDZY18yluHFJIbikDeReLA/w640-h480/2.jpg", "#", "_new", "DESCRIPTION"],
        ["https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhrzYZlkCdtnstPajXq5M-Tzvo9Yyshfjg1ta-QvdN5jYnd0kbyQ7MXsPF71GIN4Eay8e44vRdfyQdnuYDxhrqd3RkqOk4mxr20_8yUDOae435TcwOyNFyk1P7_tOvoyX-6-_6oZe4-NuACJjelyF6seKp1_ShBB8UHN8Mlyh2-h2eIRqo2WrGCm9asPg/w640-h480/3.jpg","#", "_new", "DESCRIPTION"],
        ["https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhmIf7PJjuVnoPSqIn-R7JoUxpvg_zWlGpaAQw7TLe5DglNrdxd1K3BEA4_Tr0LtXlZwkb_8vAJR7J8glmuFLjmxPmyglbXkqCrjxaVRrwrToMIV2KISvcOM8M2aYXz7iaPmpDAPfrmH8A4pO45nAFY_OmR7r5lKHZER0kVnObLw1YreQw9qTQczOCQHg/s1280/4.jpg", "#", "_new", "DESCRIPTION"],
        ["https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiQOZQ2js3J-LZUVrl8b6aPYMHPGeZ21LF2xMyp22468cb95RqncuvvSPbyyJFinRof5RDBVhFLlzUpaMmbU_t-ly2ZiBBPHH-CTKSTA7svNFLG5agZ0XmTgLXDFdAgxjkaKG4_rxJmjWp5dGav8vF454ZgC3F-bZk_8mVq2-ADflX6I2Vjv0DADxUTHw/w640-h480/5.jpg", "#", "_new", "DESCRIPTION"]         ],      
    autoplay: [true, 2000, 20], //[auto_play_boolean, delay_btw_slide_millisec, cycles_before_stopping_int]       
    persist: false, //remember last viewed slide and recall within same session?       
    fadeduration: 500, //transition duration (milliseconds)       
    oninit:function(){ //event that fires when gallery has initialized/ ready to run       
        //Keyword "this": references current gallery instance (ie: try this.navigate("play/pause"))       
    },       
    onslide:function(curslide, i){ //event that fires after each slide is shown       
        //Keyword "this": references current gallery instance       
        //curslide: returns DOM reference to current slide's DIV (ie: try alert(curslide.innerHTML)       
        //i: integer reflecting current image within collection being shown (0=1st image, 1=2nd etc)       
    }       
})
</script>
<div id="simplegallery1"></div>
