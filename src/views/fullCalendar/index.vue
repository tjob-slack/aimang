

<template>

<full-calendar class="test-fc"
    :events="fcEvents" 
    @changeMonth="$changeMonth"
    @eventClick="$eventClick"
    @dayClick="$dayClick"
    @moreClick="$moreClick"
    locale="fr"
>
     <template slot="fc-event-card" scope="p">
        <p><i class="fa">sadfsd</i> {{ p.event.title }} test</p>
    </template>
</full-calendar>


</template>

<script>
import { login,getList,getListByFunc,delObjByFunc,setObj,addObj} from "@/api/api.js";
import { toDoTranse} from "@/utils/tjobUtil.js";

const demoEvents = [
                {
                title : 'Sunny Out of Office',
                start : '2020-04-16',
                //end : '2020-04-17'
                }
                ,{
                title : 'alert',
                start : '2020-04-18',
                end : '2020-04-18',
                cssClass  : ['family', 'career']
                ,myField:{'toDo':'这是一个待办测试'}
                }
   
            ]

export default {
    data () {
    return {
        fcEvents : []
    }
    },
    components : {
        'full-calendar': require('vue-fullcalendar')	
    },
    mounted () {
        const date = new Date()

        this.getEvents(date)

    },
    methods: {
        getEvents (date) {
            console.log('fullCalendar.getEvents.date:',date)
            //this.fcEvents =  demoEvents
            this.searchData()
        }
        // 网络请求统一处理
        ,searchData(){

            var that = this;
            var param = {
                
            }
            //getList()
            getListByFunc("toDoList",param)
            .then(
                res => {

                    this.fcEvents = res.map(toDoTranse)
                    
                    console.log("searchData res:", res);
                
                },
                err => {
                    console.log("searchData err :", err);
                }
            );
        },
       '$changeMonth' (start, end, current) {
           console.log('changeMonth', start, end, current)
            //console.log('changeMonth', start.format(), end.format(), current.format())
        },
        '$eventClick' (event, jsEvent, pos) {
            console.log('eventClick', event, jsEvent, pos)
        },
        '$dayClick' (day, jsEvent) {
            console.log('dayClick', day, jsEvent)
        },
        '$moreClick' (day, events, jsEvent) {
            console.log('moreCLick', day, events, jsEvent)
        }
    }
}
</script>