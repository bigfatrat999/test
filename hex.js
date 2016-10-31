var hex = {
    rows:8
    ,cols:6
    ,colModel:[
        {
        id:"terrain"
        ,name:"地形"
        ,editOptions:def_terrain
        }
        ,{
        id:"characteristic"
        ,name:"特徴"
        ,editOptions:def_characteristic
        }
        ,{
        id:"resource"
        ,name:"資源"
        ,editOptions:def_resource
        }
        ,{
        id:"zone"
        ,name:"区域"
        ,editOptions:def_zone
        }
    ]
    ,hashdata:[]
    ,addBorder:function(data_id,y,x){
        var start_padding = 45;
        if(( 0<=x && x<hex.cols) &&( 0<=y && y<hex.rows)){
            var offset = $("#"+data_id).offset();
            var offset_to = $(".data_yx_"+y+"_"+x+"").offset();
            $("#main_div").append("<div id=\""+data_id+"_"+$(".data_yx_"+y+"_"+x+"").attr("id")+"\" class=\"border ui-widget-content\"></div>");
            $("#"+data_id+"_"+$(".data_yx_"+y+"_"+x+"").attr("id"))
                .css("top",(offset.top+offset_to.top)/2+10)
                .css("left",(offset.left+offset_to.left)/2+20);
        }
    }
    ,init:function(){
        var div_el = $("#main_div");
        div_el.width(hex.cols*75);
        div_el.height(hex.rows*60);
        var html_str = "";
        var data_id = 0;
        for(var i = 0;i<hex.rows;i++){
            var classes = "";
            html_str += "<div class=\"hex_row "+classes+" \">";
            for(var j = 0;j<hex.cols;j++){
                html_str += "<div id="+data_id+" data_id="+data_id+" data_y="+i+" data_x="+j+" class=\"hexagon data_yx_"+i+"_"+j+"\">";
                html_str += "<div class=\"hexTop\"></div>";
                html_str += "<div class=\"hexBottom\"></div>";
                html_str += "</div>";
                
                hex.hashdata.push({data_id:data_id,u:null});
                data_id++;
            }
            html_str += "</div><div class=\"clear\"/>";
        }
        div_el.append(html_str);
        
        
        for(var i = 0;i<data_id;i++){
            if(hex.hashdata[i].u==null){
                hex.hashdata[i].u = {terrain:0,resource:0,zone:0};
            };
        
            var el = $("#"+i);
            var y = el.attr("data_y");
            var x = el.attr("data_x");
            var top = y*60+45;
            var left = x*(60+10)+15;
            if(y%2 == 1){
                left +=34;
            }
            el.css("top",top)
            .css("left",left)
            .css("background-color",def_terrain[hex.hashdata[i].u.terrain].color);
        }
        
        data_id = 0;
        for(var i = 0;i<hex.rows;i++){
            var classes = "";
            for(var j = 0;j<hex.cols;j++){               
                var data_ids = [];
                data_ids.push({id:"data_id_"+(i+0)+"_"+(j+1),i:(i+0),j:(j+1)});
                data_ids.push({id:"data_id_"+(i+1)+"_"+(j+0),i:(i+1),j:(j+0)});
                data_ids.push({id:"data_id_"+(i+1)+"_"+(j+1),i:(i+1),j:(j+1)});
                data_ids.push({id:"data_id_"+(i-1)+"_"+(j-1),i:(i-1),j:(j-1)});
                data_ids.push({id:"data_id_"+(i-1)+"_"+(j+0),i:(i-1),j:(j+0)});
                data_ids.push({id:"data_id_"+(i+0)+"_"+(j-1),i:(i+0),j:(j-1)});
                for(var k=0;k<data_ids.length;k++){
                    hex.addBorder(data_id,data_ids[k].i,data_ids[k].j);
                }
                data_id++;
            }
        }
        
        // ツールチップの設定
        $('.hexagon').tooltip({
        items: '[data_id]',
        content: function() {
          var data_id = $(this).attr('data_id');
          var data_y = $(this).attr('data_y');
          var data_x = $(this).attr('data_x');
          
          var text = data_id+"番目のデータ"
          +"<br/>"+data_y+"行目"
          +"<br/>"+data_x+"列目";
          
          return text;
        }});
        
        for(var i = 0;i<hex.colModel.length;i++){
            var rows=hex.colModel[i];
            var options = "";
            for(var j = 0;j<rows.editOptions.length;j++){
                options += "<option value=\""+rows.editOptions[j].id+"\">"+rows.editOptions[j].name+"</option>";
            }
            $("#input_div").append(rows.name+"：<select id=\""+rows.id+"\">"+options+"</select><br/>");
        }
        
        
        $( "#modal-content" ).dialog({ autoOpen: false });
        $('.hexagon').bind("click",function(){
            $( "#modal-content" ).dialog( "open" );
        });
        
        $('#content_save').bind("click",function(){
            $( "#modal-content" ).dialog( "close" );
        });
        $('#file_save').bind("click",function(){
            var text = JSON.stringify("var hashdata="+hex.hashdata+";");
            var fileName = "data.js";
            var blob = new Blob([text], {type: "text/plain"}); // バイナリデータを作ります。

            // IEか他ブラウザかの判定
            if(window.navigator.msSaveBlob)
            {
                // IEなら独自関数を使います。
                window.navigator.msSaveBlob(blob, fileName);
            } else {
                // それ以外はaタグを利用してイベントを発火させます
                var a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.target = '_blank';
                a.download = fileName;
                a.click();
            }
        });
    }
};