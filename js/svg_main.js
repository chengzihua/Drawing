// author:huahua
// time:2019/8/15
!setTimeout(function(){

	//在svg内生成图片，并将图片和svg设置统一的宽度和高度

	  console.log($(".Svg_bgp").width());
    console.log($(".Svg_bgp").height());

    var flag = false;
    var key_reference = false;
    var key_draw_path = false;
    var firstTime;
    var lastTime;
    var MouseMoveupXY=[0,0];
    var img_width = $(".Svg_bgp").width();
    var img_height = $(".Svg_bgp").height();
    var reference_x;
    var reference_y;
    var endX;
    var endY;
    var select_rectangle_id;
    var rectangle_id = 0;
    var min_movetop;
    var min_moveleft;
    var rect8_index;
    var is_select_rect = false;
    var rect_end_x;
    var rect_end_y;
    var radio_total_value = [];
    var rectangle_total_value = [];
    var rectangle_total_number = [];
    var radio_total_info = [];
    radio_total_value[0] = "start";
    $(".svg_container").css("width",img_width);
    $(".svg_container").css("height",img_height);
    $(".svg_tool").css("width",img_width);
    $(".svg_tool").css("height",img_height);

    
    // $(".svg_drawing_path").bind({"click":drawing_path_mousemove});
    /*设置不同的函数，给予每一个函数一个ID号*/
        var command = 1;
        var commandCallbacks = $.Callbacks();
        commandCallbacks.add(switchCursorStyle);  //改变鼠标在不同位置时显示的方式
        $("#MoveImg").attr('class',"btn btn-success");  //默认选中移动按钮
        commandCallbacks.fire(command);

     // 点击按钮后，根据需求执行不同的命令
        $("[name='toolsOption']").click(function(){
            var val = $(this).val();
            var type = $(this).attr("id");
              // if("on" == val){
                switch(type)
                {
                  case "MoveImg"          :{command=1;break;}
                  case "Rectangle"        :{command=2;break;}
                  case "Quadrilateral"    :{command=3;break;}
                  case "RectMove"         :{command=4;break;}
                  case "Help"             :{command=5;break;}
                  default                 :{command=1;};
                }
                

                //initialize canvas context and cursor style

                commandCallbacks.fire(command);
              // }
        });



        /*设置图片在画布中放大和缩小功能*/
        var zoom = 100
        var bounding_width = $(".SvgBox").width();
        var bounding_height = $(".SvgBox").height();
        
        
        $(".svg_container").css("top",(bounding_height-img_height)/2);
        $(".svg_container").css("left",(bounding_width-img_width)/2);
        min_movetop = bounding_height-img_height;
        min_moveleft = bounding_width-img_width;
        // var thisTop = parseInt($(".svg_tool").css("top"));
        // $(function () {
            function zoomImg(o) {

            	if (zoom>=20){
               
                zoom = parseInt(o.style.zoom, 10) || 100;

                zoom += event.wheelDelta / 15; //设置滚轮滚动一次增大0.1倍
               
                if (zoom > 0) {
                    o.style.zoom = zoom + '%';
                    
                    //设置zoom变化后的值为小数
                    zoom_change = zoom/100;
                    //画布放大缩小后的宽和高（drawing_width_change，drawing_height_change）
                    var drawing_width_change = img_width*zoom_change;
                    var drawing_height_change = img_height*zoom_change;
                    //设置画布放大缩小的效果，即居中显示（left_change，top_change）
                    var left_change = (bounding_width-drawing_width_change)/2;
                    var top_change = (bounding_height-drawing_height_change)/2;
                    $(".svg_container").css("top",top_change);
                    $(".svg_container").css("left",left_change);
                    console.log("zoom_change的值为："+zoom_change);
                    min_movetop = top_change*2;
                    min_moveleft = left_change*2;
                    $(".svg_container").css("width",drawing_width_change);
                    $(".svg_container").css("height",drawing_height_change);
                    
                }
              }

                // console.log("放大后画布的宽度和高度为：",$(".svg_tool").width(),$(".svg_tool").height());
            
              else if (zoom<20){
            	  alert("不能再缩小了,请放大进行标注");
                zoom = 20;

            	// zoom = 30;
              // break;
              }
              else{
                
              }
            
            // $(document).ready(function () {
            
            }
            $(".svg_tool").bind("mousewheel",
                function () {
                    zoomImg(this);
                    flag = false;
                    return false;
                }); 

          /*
          添加删除矩形框事件,当键盘键入del键时，删除矩形框
          1、删除左侧的li元素
          2、删除矩形框
          3、改变drawing_path的路径
          4、改变rect的值
          */
          $(document).keydown(function(event){
          
          //删除绘制完成的矩形

          if(event.keyCode == 46){
            if(rectangle_id>0){

              var remove_rectangle_id = select_rectangle_id.match(/\d+(\.\d+)?/g)[0];   
              $(`#Draw_g${remove_rectangle_id}`).remove();
              $(`#Item${remove_rectangle_id}`).remove();  
              remove_rect();
              var d_value ="M0,0H0V0H0Z";
              $("#drawing_path").attr("d",d_value);
              radio_total_value[remove_rectangle_id] = "0";

            }       
          } 
          //command == 1,快捷键W
          if(event.keyCode == 87){
            command = 1;
            switchCursorStyle(command);

          }
          //command == 2,快捷键A
          if(event.keyCode == 65){
            
            command = 2;
            switchCursorStyle(command);
          }
          //command == 3,快捷键S
          if(event.keyCode == 83){
            
            command = 3;
            switchCursorStyle(command);
          }
          //command == 4,快捷键D
          if(event.keyCode == 68){
            
            command = 4;
            switchCursorStyle(command);
          }
          //command == 5,快捷键H
          if(event.keyCode == 72){
            
            command = 5;
            switchCursorStyle(command);
          }
          //快捷键J
          if(event.keyCode == 74){
            
            var select_rectangle_number = select_rectangle_id.match(/\d+(\.\d+)?/g)[0];
            // console.log(select_rectangle_number);
            var before_number = $(`#Draw_g${select_rectangle_number}`).index(".Rectangle_g")-1;
            change_rectangle_number = $(".Rectangle_g").eq(before_number).attr("id").match(/\d+(\.\d+)?/g)[0] ;
            
            if(before_number>=0){
              key_before_after(change_rectangle_number);
              select_rectangle_id='Draw_path'+change_rectangle_number;
              // console.log(select_rectangle_id);
            }
            
          //快捷键K
          }
          if(event.keyCode == 75){

            var select_rectangle_number = select_rectangle_id.match(/\d+(\.\d+)?/g)[0];
            var after_number = $(`#Draw_g${select_rectangle_number}`).index(".Rectangle_g");
            after_number++;
            if(after_number<$(".Rectangle_g").length){

              change_rectangle_number = $(".Rectangle_g").eq(after_number).attr("id").match(/\d+(\.\d+)?/g)[0] ;
              key_before_after(change_rectangle_number);
              select_rectangle_id='Draw_path'+change_rectangle_number;
              // console.log(select_rectangle_id);
            }
          }
          });


          /*
           *添加鼠标操作事件
          */
            $(".Svg_bgp").mousedown(ImgDrag);
            $(".Svg_bgp").mousemove(MoveImgField);
            $(".Svg_bgp").mouseup(MoveImgOver);
            // $("#drawing_path").mousedown(select_rectangle);
            $(".svg_tool").bind("mousedown",function(){flag=true;key_reference = false;drawing_rectangle_information()});
            $(".svg_tool").bind("mousemove",mouseMoveEventHandler);
            $(".svg_tool").mouseup(function(){flag=false;key_reference = true; mouseUpEventHandler()});
            $(".SvgBox").mouseleave(remove_reference_line);
            $(".RectangleDraw").mousedown(select_rect);
            $(".RectangleDraw").mouseup(over_rect);
            $(".radio_mark").click(radio_click);
	        /**
            *  针对不同的命令，鼠标移入画布时执行不同的命令
            */
            function switchCursorStyle(command)
            {
               switch(command){
                    case 1: {

                        $("#MoveImg").attr('class',"btn btn-success");
                        $("#Rectangle").attr('class',"btn btn-default");
                        $("#Quadrilateral").attr('class',"btn btn-default");
                        $("#RectMove").attr('class',"btn btn-default");
                        $("#Help").attr('class',"btn btn-default");
                        $(".Svg_bgp").addClass("container_moveimg");
                        $(".SelectMark").show();
                        $(".drawing_help").hide();
                        break;

                   }
                   case 2: {
                     
                     $("#MoveImg").attr('class',"btn btn-default");
                     $("#Rectangle").attr('class',"btn btn-success"); 
                     $("#Quadrilateral").attr('class',"btn btn-default");   //设置button被选中时的样式
                     $("#RectMove").attr('class',"btn btn-default");
                     $("#Help").attr('class',"btn btn-default");
                     $(".Svg_bgp").removeClass("container_moveimg");  
                     $(".SelectMark").show();
                     $(".drawing_help").hide();
                     break;
                   }
                   case 3: {

                     $("#MoveImg").attr('class',"btn btn-default")
                     $("#Rectangle").attr('class',"btn btn-default");
                     $("#Quadrilateral").attr('class',"btn btn-success");
                     $("#RectMove").attr('class',"btn btn-default");
                     $("#Help").attr('class',"btn btn-default");
                     $(".Svg_bgp").removeClass("container_moveimg");
                     $(".SelectMark").show();
                     $(".drawing_help").hide();
                    break;

                   }
                  case 4:{
                    $("#MoveImg").attr('class',"btn btn-default");
                    $("#Rectangle").attr('class',"btn btn-default");
                    $("#Quadrilateral").attr('class',"btn btn-default");   //设置button被选中时的样式 
                    $("#RectMove").attr('class',"btn btn-success");
                    $("#Help").attr('class',"btn btn-default");
                    $(".Svg_bgp").removeClass("container_moveimg");
                    $(".SelectMark").show();
                    $(".drawing_help").hide();
                    break;
                  }
                  case 5:{
                    $("#MoveImg").attr('class',"btn btn-default")
                    $("#Quadrilateral").attr('class',"btn btn-default");   //设置button被选中时的样式
                    $("#Rectangle").attr('class',"btn btn-default");
                    $("#RectMove").attr('class',"btn btn-default");
                    $("#Help").attr('class',"btn btn-success");
                    $(".Svg_bgp").removeClass("container_moveimg");
                    $(".SelectMark").hide();
                    $(".drawing_help").show();
                    
                    break;
                  }
                  default:{  
                    break;
                  }
               }
           }      

           /*
           command为1时，执行mousedown事件,
           此时记录下鼠标时相对于画布的位置：MouseMoveupXY
           */
           function ImgDrag(event){

           	    
           	    if (command == 1 ){
           	    	  flag = true;
           	        var e = event || window.event;
                    //鼠标点击时相对于画布的位置(x,y)
                    var y= e.offsetY;
                    var x= e.offsetX;
                    MouseMoveupXY=[x,y];
                    

            }

           }

           /*
           command为1时，执行MoveImgField事件，
           */
           function MoveImgField(event){

           	    if (command == 1){
           	    	if(flag){
           	    		var thisTop = parseInt($(".svg_container").css("top"));
           	    		var thisLeft = parseInt($(".svg_container").css("left"));
           	    		
           	    		var e = event || window.event;
           	    		var y = e.offsetY;
           	    		var x = e.offsetX;
                        var left_change = x - MouseMoveupXY[0];
                        var top_change = y - MouseMoveupXY[1];
                        
                        if (min_moveleft<0){
                          if(thisLeft<=0&&thisLeft>=min_moveleft){
                              thisLeft += left_change;
                              $(".svg_container").css("left",thisLeft);
                          }
                          else if(thisLeft>0){
                          
                            
                            $(".svg_container").css("left",0);
                            flag=false;
                          }
                          else{
                          
                            $(".svg_container").css("left",min_moveleft);
                            flag=false;
                          }
                        }
                        else{
                          // console.log("不能左右移动");
                        }
                        if (min_movetop<0){
                          if(thisTop<1&&thisTop>=min_movetop){
                            thisTop += top_change;
                            $(".svg_container").css("top",thisTop);
                          }
                          else if (thisTop>0){
                          
                            $(".svg_container").css("top",0);
                            flag=false;
                          }
                          else{
                           
                            $(".svg_container").css("top",min_movetop);
                            flag=false;
                          }
                        }
                        else{
                          // console.log("不能左右移动");
                          
                        }         
           	    	}
                  else{
                       
                  }
           	    }
           }

           /*
           command为1时，执行MoveImgOver事件，
           */
           function MoveImgOver(){

           	    if (command == 1){
           	    	flag = false;
           	    }
           }

           /*
           command为2时，出现参考线;
           command为4时，可以触发移动矩阵事件;
           */
           function mouseMoveEventHandler(event){
                if (command == 2){
                    if(flag==false){
                      key_reference = true;
                	    var e = event || window.event;
           	    	    var reference_y = e.offsetY / (zoom/100);
           	    	    var reference_x = e.offsetX / (zoom/100);
                      add_reference_line(reference_x,reference_y);
                      // $(".svg_tool").find(".svg_drawing_path").mousemove(select_rectangle);

                    }
                    else{
                      key_reference = false;
                      rectangle_input(reference_x,reference_y);
                    }
                }
                if(command==3){
                  if(is_select_rect){
                    var e = event || window.event;
                    rect_end_y = e.offsetY / (zoom/100);
                    rect_end_x = e.offsetX / (zoom/100);
                    var d_value = $(`#${select_rectangle_id}`).attr("d");
                    move_select_Quadrilateral(d_value,rect_end_x,rect_end_y);
                   
                    
                  }

                }
                if(command==4){
                  if(is_select_rect){
                    var e = event || window.event;
                    var rect_end_y = e.offsetY / (zoom/100);
                    var rect_end_x = e.offsetX / (zoom/100); 
                    var d_value = $(`#${select_rectangle_id}`).attr("d");
                    move_select_rectangle(d_value,rect_end_x,rect_end_y);

                  }
                    
                }
                    
                
                
          }
        /*
          
          command为2和3时，显示参考线
        */
        function add_reference_line(x,y){
            if(key_reference){
            /*
            获取参考线的两个端点的坐标值
            x轴：(0,mouse_top,img_width,mouse_top)
            y轴：(mouse_left,0,mouse_left,img_height)
            引进的参数(x,y)指的是(mouse_left,mouse_top)
            */
            
  
            var X_y1 = $(".svg_g_container").find(".line_X").attr("y1");
            var X_y2 = $(".svg_g_container").find(".line_X").attr("y2");
            var Y_x1 = $(".svg_g_container").find(".line_Y").attr("x1");
            var Y_x2 = $(".svg_g_container").find(".line_Y").attr("x2");
            var X_x2 = img_width;
            var Y_y2 = img_height;
            
            //改变参考线两个端点的坐标值
            X_y1 = y;
            X_y2 = y;
            Y_x1 = x;
            Y_x2 = x;
            reference_x = x;
            reference_y = y;

            $(".svg_line_container").find(".line_X").attr("y1",get_value(X_y1));
            $(".svg_line_container").find(".line_X").attr("x2",get_value(X_x2));
            $(".svg_line_container").find(".line_X").attr("y2",get_value(X_y2));
            $(".svg_line_container").find(".line_Y").attr("x1",get_value(Y_x1));
            $(".svg_line_container").find(".line_Y").attr("x2",get_value(Y_x2));
            $(".svg_line_container").find(".line_Y").attr("y2",get_value(Y_y2));
          
          }
        }

          function get_value(value){
            return value;
          }
        
        /*
          移除参考线
        */
        function remove_reference_line(){


            $(".svg_line_container").find(".line_X").attr("y1",0);
            $(".svg_line_container").find(".line_X").attr("x2",0);
            $(".svg_line_container").find(".line_X").attr("y2",0);
            $(".svg_line_container").find(".line_Y").attr("x1",0);
            $(".svg_line_container").find(".line_Y").attr("x2",0);
            $(".svg_line_container").find(".line_Y").attr("y2",0);

        }

        function drawing_rectangle_alert(){
          alert("未生成任何框")
        }
        function drawing_rectangle_information(event){

          if (command==2){
            
            firstTime = new Date().getTime();
            
            var mouseclick_y = reference_y;
            var mouseclick_x = reference_x;
            
            lastTime = new Date().getTime();
              if((lastTime - firstTime)>500){
                key_mousedown_click = true;
              }
              else{
                key_mousedown_click = false;
              }
              
              if (flag){
              add_one_rectangle_id();
              add_one_rectangle();
              // add_one_radio_value();
              }

            

              remove_rect();
          }

        }
          
          function remove_rect(){

            var rect_list_size = $(".RectangleDraw").length;
              
            for(var i=0;i<rect_list_size;i++){
                
              $(".RectangleDraw").eq(i).attr("x","0");
              $(".RectangleDraw").eq(i).attr("y","0");
            
            }

          }
          function add_one_rectangle_id(){

            rectangle_id +=1;
            $("<li>",{

              class:"IdMenuItem",
              id:"Item"+rectangle_id

            }).appendTo($(".BoundingIdMenLight"));

            //向li标签内添加内容
            BoundingIdContext = "矩形"+rectangle_id;
            $(`#Item${rectangle_id}`).html(`${BoundingIdContext}`);
          }

          function add_one_rectangle(){

            if(flag){
              
              // var html = "<path d='M1359,1067H1497V1188H1359Z' style='fill:none; stroke:black; stroke-width: 2' />";
              
              var add_g = document.createElementNS("http://www.w3.org/2000/svg","g");
              
              $(add_g).appendTo($(".svg_tool"));
              $(add_g).attr("class","Rectangle_g");
              $(add_g).attr("id",get_value("Draw_g"+(rectangle_id)));

              var add_path = document.createElementNS("http://www.w3.org/2000/svg","path");
              $(add_path).appendTo($(`#Draw_g${rectangle_id}`));
              $(add_path).attr("class","Rectangle_path");
              $(add_path).attr("id",get_value("Draw_path"+(rectangle_id)));
              
            }

          }

          function add_one_radio_value(){
           
            var radio_value = $("input[type=radio]:checked").val();
            // console.log("radio_value",radio_value);
            radio_total_value[rectangle_id] = radio_value;
            // console.log(radio_total_value);
          }

          /*
            mousedown事件执行后，开始绘制矩形
          */
          function rectangle_input(event){

            if(flag==true){
              var e = event || window.event;
              endX = e.offsetX /(zoom/100);
              endY = e.offsetY /(zoom/100);
              var path_d = "M" + reference_x + "," + reference_y +'H'+endX+'V'+endY+'H'+reference_x+'Z';  
              $(`#Draw_path${rectangle_id}`).attr("d",get_value(path_d));
              $('#drawing_path').attr("d",get_value(path_d)); //绘制不完全透明的矩形   
            }
          }

          function mouseUpEventHandler(){
 
            if (command==2){
              

              bind_mouse_event();
              change_rect_index();
              isflase_rectangle();
              
            }
            if (command==3){
              is_select_rect = false;
            }
            if(command==4){
              is_select_rect = false;
            }

          }
            
            /*
              点击鼠标选中矩形框，改变drawing_path以及rect_8的区域
            */
            function bind_mouse_event(){
              $(`#Draw_path${rectangle_id}`).bind({"click":draw_path_click,
                                                  
                                                  });
              $(`#Item${rectangle_id}`).bind({"click":li_item_click});
              select_rectangle_id = $(`#Draw_path${rectangle_id}`).attr("id");
      
            }

              function draw_path_click(event){

                if(command==4){
                  key_draw_path = true;
                
                  var d_value = $(event.target).attr("d");
                  select_rectangle_id = $(event.target).attr("id");
                  select_rectangle_number = select_rectangle_id.match(/\d+(\.\d+)?/g)[0];
            
                  // console.log("select_rectangle_id",select_rectangle_id);
                  if(d_value.indexOf("H")>-1){
                    // li_length = $(".IdMenuItem").length;
                    for(i=0;i<rectangle_id;i++){ 
                      if (i+1==select_rectangle_number){
                        $(`#Item${i+1}`).addClass("current_li");
                      }  
                      else{
                      $(`#Item${i+1}`).removeClass("current_li");
                      } 
                    }
                    change_drawing_path(d_value);
                    change_rect_8(d_value);
                    
                  }
                  else{
                    
                  }
                }

                if(command==3){
                  key_draw_path = true;
                  var d_value = $(event.target).attr("d");
                  select_rectangle_id = $(event.target).attr("id");
                  select_rectangle_number = select_rectangle_id.match(/\d+(\.\d+)?/g)[0];
                  // li_length = $(".IdMenuItem").length;
                  for(i=0;i<rectangle_id;i++){ 
                    if (i+1==select_rectangle_number){
                      $(`#Item${i+1}`).addClass("current_li");
                    }  
                    else{
                      $(`#Item${i+1}`).removeClass("current_li");
                    } 
                  }
                  //如果点击的是矩形
                  if(d_value.indexOf("H")>-1){
                    change_drawing_path(d_value);
                    change_rect_8(d_value);
                  }
                  else{
                    change_drawing_path(d_value);
                    quad_change_rect_8(d_value);
                  }
                }
                
                select_rectangle_id = $(event.target).attr("id");
                select_rectangle_number = select_rectangle_id.match(/\d+(\.\d+)?/g)[0];
                change_radio_value(select_rectangle_number);
                


              }
                /*

                当选中矩形框时改变radio的值
                */
                function change_radio_value(number){
                  
                  var select_radio_number = radio_total_value[number];
                  // console.log("select_radio_number",select_radio_number);
                  for(i=0;i<6;i++){
                    if(i==select_radio_number-1){

                      $("input[name='Mark']").get(i).checked=true; 
                       // $(".radio_mark").eq(i).attr("checked","checked");
                    }
                    else{
                      $("input[name='Mark']").get(i).checked=false; 
                    }
                  }
                
                // console.log(radio_total_value);
                }


                function change_drawing_path(d_value){
                  $("#drawing_path").attr("d",d_value);
                }
                function change_rect_8(d_value){

                  var rect_list_size = $(".RectangleDraw").length;
              
                  var x1 = d_value.match(/\d+(\.\d+)?/g)[0];
                  var y1 = d_value.match(/\d+(\.\d+)?/g)[1];
                  var x2 = d_value.match(/\d+(\.\d+)?/g)[2];
                  var y2 = d_value.match(/\d+(\.\d+)?/g)[3];
                  var rect_left_x = x1-2.5 ;
                  var rect_top_y = y1 - 2.5;
                  var rect_right_x = x2-2.5;
                  var rect_bottom_y = y2 - 2.5;
                  var rect_center_x = (rect_right_x-rect_left_x)/2+rect_left_x;
                  var rect_center_y = (rect_bottom_y-rect_top_y)/2+rect_top_y;

                  for(var i=0;i<rect_list_size;i++){
                
                    if(i==0 ||i==6 ||i==7){
                      $(".RectangleDraw").eq(i).attr("x",rect_left_x);
                    }
                    else if(i==1||i==5){
                      $(".RectangleDraw").eq(i).attr("x",rect_center_x);
                    }
                    else{
                      $(".RectangleDraw").eq(i).attr("x",rect_right_x);
                    }
               
                  }
                  for(var j=0;j<rect_list_size;j++){
                    if(j==0 ||j==1 ||j==2){
                      $(".RectangleDraw").eq(j).attr("y",rect_top_y);
                    }
                    else if(j==3||j==7){
                      $(".RectangleDraw").eq(j).attr("y",rect_center_y);
                    }
                    else{
                      $(".RectangleDraw").eq(j).attr("y",rect_bottom_y);
                    }


                  }

                }
            function li_item_click(event){
               
              var select_li_id = $(event.target).attr("id");
              var select_li_number = select_li_id.match(/\d+(\.\d+)?/g)[0];
              select_rectangle_id = 'Draw_path'+select_li_number;
              // li_length = $(".IdMenuItem").length;
              for(i=0;i<rectangle_id;i++){
                  if (i+1==select_li_number){
                    $(`#Item${i+1}`).addClass("current_li");
                  }
                  else{
                    $(`#Item${i+1}`).removeClass("current_li");
                  }
                
              }
              var d_value =$(`#Draw_path${select_li_number}`).attr("d");
              change_drawing_path(d_value);
              //如果选中的是矩形
              if(d_value.indexOf("H")>-1){
                change_rect_8(d_value);
              }
              else{
                quad_change_rect_8(d_value);
              }

              // console.log("select_li_number",select_li_number);
              // console.log("select_rectangle_id",select_rectangle_id);
              change_radio_value(select_li_number);

            }
            function isflase_rectangle(){
              
              
              var d_value = $(`#Draw_path${rectangle_id}`).attr("d");
              if(typeof(d_value)=="undefined"){
                
                  
                  $(".Rectangle_g").eq(rectangle_id-1).remove();
                  $(`#Item${rectangle_id}`).remove();
                  rectangle_id = rectangle_id-1;
                  remove_rect();
                  $("#drawing_path").attr("d","M0,0H0V0H0Z"); 
              }
              else{
                
                var x1 = d_value.match(/\d+(\.\d+)?/g)[0];
                var y1 = d_value.match(/\d+(\.\d+)?/g)[1];
                var x2 = d_value.match(/\d+(\.\d+)?/g)[2];
                var y2 = d_value.match(/\d+(\.\d+)?/g)[3];
                if(x2-x1>2&&y2-y1>2){
                  add_one_radio_value();
                  // console.log("不用移除矩阵");
                }
                else{
                  // console.log("移除矩形");
                  $(".Rectangle_g").eq(rectangle_id-1).remove();
                  $(`#Item${rectangle_id}`).remove();
                  rectangle_id = rectangle_id-1;
                  remove_rect();
                  $("#drawing_path").attr("d","M0,0H0V0H0Z"); 
                  // radio_total_value.splice(radio_total_value[rectangle_id],1);
                }
              }
              
                  
            }

            function change_rect_index(){
              
              var rect_list_size = $(".RectangleDraw").length;
              
              var rect_left_x = reference_x-2.5 ;
              var rect_top_y = reference_y - 2.5;
              var rect_right_x = endX-2.5;
              var rect_bottom_y = endY - 2.5;
              var rect_center_x = (rect_right_x-rect_left_x)/2+rect_left_x;
              var rect_center_y = (rect_bottom_y-rect_top_y)/2+rect_top_y;
              // console.log(reference_x,reference_y,endX,endY);
              for(var i=0;i<rect_list_size;i++){
                
                
                
                
                if(i==0 ||i==6 ||i==7){
                  $(".RectangleDraw").eq(i).attr("x",rect_left_x);
                }
                else if(i==1||i==5){
                  $(".RectangleDraw").eq(i).attr("x",rect_center_x);
                }
                else{
                  $(".RectangleDraw").eq(i).attr("x",rect_right_x);
                }
               
              }
              for(var j=0;j<rect_list_size;j++){
                if(j==0 ||j==1 ||j==2){
                  $(".RectangleDraw").eq(j).attr("y",rect_top_y);
                }
                else if(j==3||j==7){
                  $(".RectangleDraw").eq(j).attr("y",rect_center_y);
                }
                else{
                  $(".RectangleDraw").eq(j).attr("y",rect_bottom_y);
                }


              }

            }
            function change_path_style(){
              var rectangle_g_list_size = $(".Rectangle_g").length;
              
              
            }

      
      function drawing_path_mousemove(){
        // console.log("绘制图形的框移动情况");
      }
      
      function select_rect(event){
        
        if (command==4){
         
          rect8_index = $(event.target).attr("id");

          is_select_rect = true;

        }
        if (command==3){
          is_select_rect = true;
          rect8_index = $(event.target).attr("id");
          var d_value = $(`#${select_rectangle_id}`).attr("d");
          if(d_value.indexOf("H")>-1){
            // console.log("改变path的d为四边形");
            var x1 = d_value.match(/\d+(\.\d+)?/g)[0];
            var y1 = d_value.match(/\d+(\.\d+)?/g)[1];
            var x2 = d_value.match(/\d+(\.\d+)?/g)[2];
            var y2 = d_value.match(/\d+(\.\d+)?/g)[3];
            d_value = "M" + x1 + "," + y1 +"L"+x2+","+y1+"L"+x2+","+y2+"L"+x1+","+y2+"Z"; 
            $(`#${select_rectangle_id}`).attr("d",d_value);
          }
          else{
            // console.log("不用改变path的d值");
          }
          
        }
      }

      function change_select_x(){
        if(command==4){
          $(".svg_tool").svg
        }
          var e = event || window.event;
          var y = e.offsetY;
          var x = e.offsetX;
          // console.log("鼠标移动的位置是",x,y);
          
      }
      
      function over_rect(){
        if(command==4 ||command==3){
          is_select_rect = false;
        }
        
      }
      
      function move_select_rectangle(d_value,rect_end_x,rect_end_y){
        
        
        var x1 = d_value.match(/\d+(\.\d+)?/g)[0];
        var y1 = d_value.match(/\d+(\.\d+)?/g)[1];
        var x2 = d_value.match(/\d+(\.\d+)?/g)[2];
        var y2 = d_value.match(/\d+(\.\d+)?/g)[3];
        var d_value;
        
        switch(rect8_index){
            case "rect1": {
               console.log("移动左上角");
               x1 = rect_end_x;
               y1 = rect_end_y;    
              break;
            }
            case "rect3": {
               console.log("移动右上角");
               y1 = rect_end_y;
               x2 = rect_end_x;
               break;
            }
            case "rect5": {
               console.log("移动右下角");
               x2 = rect_end_x;
               y2 = rect_end_y;
               break;
               
            }
            case "rect7": {
               console.log("移动左下角");
               x1 = rect_end_x;
               y2 = rect_end_y;
               break;
            }
            default:{  
                    break;
                  }
 
        }
        d_value = "M" + x1 + "," + y1 +'H'+x2+'V'+y2+'H'+x1+'Z'; 
        change_rect_8(d_value);
        $(`#${select_rectangle_id}`).attr("d",get_value(d_value));
        $('#drawing_path').attr("d",get_value(d_value)); //绘制不完全透明的矩形
      }

      function move_select_Quadrilateral(d_value,rect_end_x,rect_end_y){
        var x1 = d_value.match(/\d+(\.\d+)?/g)[0];
        var y1 = d_value.match(/\d+(\.\d+)?/g)[1];
        var x2 = d_value.match(/\d+(\.\d+)?/g)[2];
        var y2 = d_value.match(/\d+(\.\d+)?/g)[3];
        var x3 = d_value.match(/\d+(\.\d+)?/g)[4];
        var y3 = d_value.match(/\d+(\.\d+)?/g)[5];
        var x4 = d_value.match(/\d+(\.\d+)?/g)[6];
        var y4 = d_value.match(/\d+(\.\d+)?/g)[7];
        
        switch(rect8_index){
            case "rect1": {
               console.log("移动左上角");
               x1 = rect_end_x;
               y1 = rect_end_y;    
              break;
            }
            case "rect3": {
               console.log("移动右上角");
               x2 = rect_end_x;
               y2 = rect_end_y;
               break;
            }
            case "rect5": {
               console.log("移动右下角");
               x3 = rect_end_x;
               y3 = rect_end_y;
               break;
               
            }
            case "rect7": {
               console.log("移动左下角");
               x4 = rect_end_x;
               y4 = rect_end_y;
               break;
            }
            default:{  
                    break;
                  }
            
        }
        d_value = "M" + x1 + "," + y1 +"L"+x2+","+y2+"L"+x3+","+y3+"L"+x4+","+y4+"Z"; 
        $('#drawing_path').attr("d",get_value(d_value)); //绘制不完全透明的矩形
        $(`#${select_rectangle_id}`).attr("d",get_value(d_value));
        quad_change_rect_8(d_value);
      }

        function quad_change_rect_8(d_value){
          
          
          var rect1_x = d_value.match(/\d+(\.\d+)?/g)[0]-2.5;
          var rect1_y = d_value.match(/\d+(\.\d+)?/g)[1]-2.5;
          var rect3_x = d_value.match(/\d+(\.\d+)?/g)[2]-2.5;
          var rect3_y = d_value.match(/\d+(\.\d+)?/g)[3]-2.5;
          var rect5_x = d_value.match(/\d+(\.\d+)?/g)[4]-2.5;
          var rect5_y = d_value.match(/\d+(\.\d+)?/g)[5]-2.5;
          var rect7_x = d_value.match(/\d+(\.\d+)?/g)[6]-2.5;
          var rect7_y = d_value.match(/\d+(\.\d+)?/g)[7]-2.5;
          var rect2_x = (rect3_x + rect1_x)/2;
          var rect2_y = (rect3_y + rect1_y)/2;
          var rect4_x = (rect5_x + rect3_x)/2;
          var rect4_y = (rect5_y + rect3_y)/2;
          var rect6_x = (rect7_x + rect5_x)/2;
          var rect6_y = (rect7_y + rect5_y)/2;
          var rect8_x = (rect1_x + rect7_x)/2;
          var rect8_y = (rect1_y + rect7_y)/2;

          $("#rect1").attr("x",rect1_x);
          $("#rect1").attr("y",rect1_y);
          $("#rect2").attr("x",rect2_x);
          $("#rect2").attr("y",rect2_y);
          $("#rect3").attr("x",rect3_x);
          $("#rect3").attr("y",rect3_y);
          $("#rect4").attr("x",rect4_x);
          $("#rect4").attr("y",rect4_y);
          $("#rect5").attr("x",rect5_x);
          $("#rect5").attr("y",rect5_y);
          $("#rect6").attr("x",rect6_x);
          $("#rect6").attr("y",rect6_y);
          $("#rect7").attr("x",rect7_x);
          $("#rect7").attr("y",rect7_y);
          $("#rect8").attr("x",rect8_x);
          $("#rect8").attr("y",rect8_y);


        }
        
        function radio_click(event){
          
          if(select_rectangle_id){

            var select_rectangle_number = select_rectangle_id.match(/\d+(\.\d+)?/g)[0];
            var select_radio_number = $(event.target).attr("value"); 
            radio_total_value[select_rectangle_number] = select_radio_number;
          }
          
        }

        function key_before_after(change_rectangle_number){
          if(select_rectangle_id){
             
              
              // li_length = $(".IdMenuItem").length;
              for(i=0;i<rectangle_id;i++){
                  if (i+1==change_rectangle_number){
                    $(`#Item${i+1}`).addClass("current_li");
                  }
                  else{
                    $(`#Item${i+1}`).removeClass("current_li");
                  }
                
              }
              var d_value =$(`#Draw_path${change_rectangle_number}`).attr("d");
              change_drawing_path(d_value);
              //如果选中的是矩形
              if(d_value.indexOf("H")>-1){
                change_rect_8(d_value);
              }
              else{
                quad_change_rect_8(d_value);
              }

              change_radio_value(change_rectangle_number);

          }

        }
 

        $("#submit_task").click(get_all_value);
        function get_all_value(){
          rectangle_all_length = $(".Rectangle_g").length;
          // console.log(rectangle_all_length);
          for(i=0;i<rectangle_all_length;i++){

            rectangle_total_number[i] = $(".Rectangle_g").eq(i).attr("id").match(/\d+(\.\d+)?/g)[0];
            rectangle_total_value[i] = $(".Rectangle_path").eq(i).attr("d");
            radio_total_info[i] = radio_total_value[rectangle_total_number[i]];

          }
          console.log("矩阵的id号",rectangle_total_number);
          console.log("矩阵的路径值",rectangle_total_value);
          console.log("单选框的值",radio_total_info);
        }
        
},100);
  
