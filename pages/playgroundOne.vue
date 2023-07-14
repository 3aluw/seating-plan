<template>
    <div class="conatiner">
        <nav class="navbar flex justify-around mt-12">
            <v-btn variant="plain">Home</v-btn>
            <v-btn variant="plain" @click="showModifyPlan = true">Modify paln</v-btn>
            <ModifyPlan v-model="showModifyPlan" />
            <v-btn variant="plain" @click="showChangePlan = true">change plan</v-btn>
            <ChosePlan v-model="showChangePlan" />
        </nav>

        <div id="print" ref="playgroundRef" class="playground-cont shadow-lg mt-10 mb-5  ">
            <div class="relative playground-item" v-show="showPlayground"
                v-for="(student, index) in    planStore.plans[planStore.currentPlanIndex].tableData" ref="studentRefs"
                :style="draggables[index]?.style" :class="{
                    'overlappedItem': index === overlappedItem,
                    'UShapeRotatedItem': rotateItem(index)
                }">
                <p class="h-full w-full text-center">{{ student?.name }} </p>


                <i class="top-0 moving-btn mdi-cursor-move mdi v-icon notranslate v-theme--light v-icon--size-default"
                    aria-hidden="true"></i>
                <i v-if="student.fieldOne"
                    class="bottom-0 right-0 info-icon mdi-information-outline fa-1x mdi notranslate v-theme--light v-icon--size-default"
                    aria-hidden="true"> <v-tooltip activator="parent" location="bottom">{{ student.fieldOne }}
                    </v-tooltip></i>
            </div>
        </div>

        <div class="action-btns flex justify-around">
            <v-btn prepend-icon="mdi-undo" color="blue-darken-4" variant="outlined" @click="planStore.undoChanges">Undo
                changes</v-btn>

            <v-btn prepend-icon="mdi-autorenew" color="blue-darken-4" variant="outlined"
                @click="planStore.shufflePlan">randomize</v-btn>
            <v-btn prepend-icon="mdi-printer" color="blue-darken-4" variant="outlined" @click="printPlan">Print</v-btn>
        </div>

    </div>
</template>
<script setup>
import { usePlanStore } from '~/store/planStore'
const planStore = usePlanStore();



//chek if it is larger than md screen
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanSm = breakpoints.greater('sm')


//show component  
const showChangePlan = ref(false)
const showModifyPlan = ref(false)
const showPlayground = ref(false)
//overlapped item to change its background
let overlappedItem = ref(null)










const itemWidth = ref(150)
const itemHeight = ref(50)
const singleMargin = ref(20)
const XObj = ref([0])

//U-shape logic
const studentsNumberBaseLine = computed(() => Math.ceil(planStore.plans[planStore.currentPlanIndex].tableData.length / 3))
const studentsnumberLeftLine = computed(() => Math.ceil((planStore.plans[planStore.currentPlanIndex].tableData.length - studentsNumberBaseLine.value) / 2))
const rightLineStartIndex = computed(() => studentsnumberLeftLine.value + studentsNumberBaseLine.value)
//roatate items if it is in the left or right line U-Shape
const rotateItem = (index) => {
    const baseLineStartIndex = rightLineStartIndex.value - studentsNumberBaseLine.value;
    return index < baseLineStartIndex || index > rightLineStartIndex.value - 1 ? true : false
}



//Rows and pairs logic
const columns = ref(3)
const studentsPerRow = computed(() => columns.value * 2)



const generateXObj = () => {
    if (planStore.plans[planStore.currentPlanIndex].seatType == "0") {
        for (let i = 1; i < studentsPerRow.value; i++) {
            let lastItemX = XObj.value[i - 1]
            i % 2 === 0 ? XObj.value.push(lastItemX + itemWidth.value + singleMargin.value * 2.5) : XObj.value.push(lastItemX + itemWidth.value + singleMargin.value * 0.8)
        }
    }
    else if (planStore.plans[planStore.currentPlanIndex].seatType == "1") {
        for (let i = 1; i < studentsPerRow.value; i++) {
            let lastItemX = XObj.value[i - 1]
            XObj.value.push(lastItemX + itemWidth.value + singleMargin.value)
        }
    }
    else if (planStore.plans[planStore.currentPlanIndex].seatType == "2") {
        //added some weird math to make the left and rotate possible
        const baseLineStartX = itemHeight.value
        const leftLineStartX = baseLineStartX + itemWidth.value * studentsNumberBaseLine.value
        XObj.value.push(baseLineStartX, leftLineStartX)
    }

}


/*
const XObj = ref({
    //Object that has x values (assuming there are three rows in classrom )Even: +110 ; odd : +120
    0: 0,
    1: 110,
    2: 230,
    3: 340,
    4: 460,
    5: 570,
})
*/
const studentRefs = ref([])
const draggables = ref([])
const playgroundRef = ref(null)

onMounted(() => {
    generateXObj();


    for (let x in planStore.plans[planStore.currentPlanIndex].tableData) {
        draggables.value.push(useDraggable(studentRefs.value[x], {
            initialValue: defineLocation(x),

            onStart(position) {
                //fixes coordinates snap when start dragging
                position.y += (playgroundRef.value.getBoundingClientRect().top - playgroundRef.value.scrollTop)
                position.x += (playgroundRef.value.getBoundingClientRect().left - playgroundRef.value.scrollLeft)
            },
            onMove(position) {



                //find the overlapped item to change its style
                let targetXIndex = findTargetXIndex(position);
                const toIndex = FindNdOverlapingItem(x, targetXIndex)
                overlappedItem.value = toIndex

            },
            onEnd(position) {

                //find the x index of the target location
                let targetXIndex = findTargetXIndex(position);
                //save th initial location so the item returns to it
                let inintialLocation = defineLocation(x);
                position.x = inintialLocation.x;
                position.y = inintialLocation.y;
                //find the index of the target item and swap them
                const toIndex = FindNdOverlapingItem(x, targetXIndex)
                swapStudents(x, toIndex)

                //to reset teh styling of the overlapped item
                overlappedItem.value = null


            }
        }));
    }

    showPlayground.value = true

})

const defineLocation = (index) => {
    //check if we aren't using U-shape type
    if (planStore.plans[planStore.currentPlanIndex].seatType !== "2") {
        const yIndex = Math.floor(index / studentsPerRow.value)
        const xIndex = index - studentsPerRow.value * yIndex

        const x = XObj.value[xIndex]
        const y = (yIndex) * 60
        return { x: x, y: y }
    } else {
        return defineULocation(index)
    }
}


const defineULocation = (index) => {

    if (index < studentsnumberLeftLine.value) {
        const x = XObj.value[0];
        const y = itemWidth.value * index
        return { x: x, y: y }
    }
    else if (index < rightLineStartIndex.value) {
        const y = studentsnumberLeftLine.value * itemWidth.value;
        const x = XObj.value[1] + itemWidth.value * (index - studentsnumberLeftLine.value);
        return { x: x, y: y }
    } else {
        const x = XObj.value[2];
        const y = (studentsnumberLeftLine.value * itemWidth.value) - (itemWidth.value * (index - rightLineStartIndex.value + 1))
        return { x: x, y: y }
    }
}


const findTargetXIndex = (position) => {
    let i = 0;
    const halfWidth = itemWidth.value / 2
    while (i <= studentsPerRow.value) {
        if (position.x + halfWidth - XObj.value[i] < itemWidth.value) { return i }
        i++
    }
}

const FindNdOverlapingItem = (movingItemIndex, toXIndex) => {
    const rect1 = studentRefs.value[movingItemIndex].getBoundingClientRect()

    for (let i = 0; i < Math.ceil(studentRefs.value.length / studentsPerRow.value); i++) {
        const rect2 = studentRefs.value[toXIndex + (i * studentsPerRow.value)]?.getBoundingClientRect();

        if (rect2 && !(
            rect1.top > rect2.bottom ||
            rect1.right < rect2.left ||
            rect1.bottom < rect2.top ||
            rect1.left > rect2.right
        ) && !(movingItemIndex == toXIndex + (i * studentsPerRow.value))) { return toXIndex + (i * studentsPerRow.value); }
    }
}


//buttons'events
const swapStudents = (fromIndex, toIndex) => {
    if (toIndex >= 0) {
        const temp = planStore.plans[planStore.currentPlanIndex].tableData[fromIndex];
        planStore.plans[planStore.currentPlanIndex].tableData[fromIndex] = planStore.plans[planStore.currentPlanIndex].tableData[toIndex];
        planStore.plans[planStore.currentPlanIndex].tableData[toIndex] = temp;
    }
}


const printPlan = () => {
    /*   // Get HTML to print from element
       const prtHtml = document.getElementById('print').innerHTML;
   
       // Get all stylesheets HTML
       let stylesHtml = '';
       for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
           stylesHtml += node.outerHTML;
       }
   
       // Open the print window
       const WinPrint = window.open('', '', 'left=0,top=0,width=700,height=900,toolbar=0,scrollbars=0,status=0, ');
   
       WinPrint.document.write(`<!DOCTYPE html>
   <html>
     <head>
       ${stylesHtml}
     </head>
     <body>
       ${prtHtml}
     </body>
   </html>`);
   
   
       WinPrint.document.close();
       WinPrint.focus();
       WinPrint.print();
       setTimeout(() => { WinPrint.close(); console.log(5) }, 1000)
       //WinPrint.close();*/
    window.print()
}
</script>

<style>
/*deleting a    weird teleport item */
.navbar>div {
    display: none;
}

.playground-cont {
    position: relative;
    margin-inline: 3rem;
    padding: 5rem;
    min-height: 30rem;
    background: rgba(222, 219, 219, 0.50);
    /* outline-color: rgba(222, 219, 219, 0.50);
    outline-width: 1.3rem;*/
    /*transform: scale(1.5);
    transform-origin: 0 0;
    
*/
    overflow: scroll;
}

.playground-cont::-webkit-scrollbar {
    width: 5px;
    /* Width of the scrollbar */
}

.playground-cont::-webkit-scrollbar-track {
    background-color: rgb(170, 167, 167);
    /* Color of the scrollbar track */
}

.playground-cont::-webkit-scrollbar-thumb {
    background-color: rgb(104, 103, 103);
    /* Color of the scrollbar thumb */
    border-radius: 5px;
}

.moving-btn {
    position: absolute;
    padding: 0;
    cursor: move;
    pointer-events: auto;
}

.info-icon {
    position: absolute;
    padding: 0;
    cursor: default;
    pointer-events: auto;
}

.playground-item {
    pointer-events: none;
    position: absolute;
    width: 150px;
    border: black solid 1px;
    height: 50px;

}

.UShapeRotatedItem {
    pointer-events: none;
    position: absolute;
    width: 50px;
    border: black solid 1px;
    height: 150px;

}

.overlappedItem {
    background: yellow;
    opacity: 0.8;
}



@media print {


    .action-btns,
    .navbar {
        display: none;
    }


    .playground-cont {
        display: block;
        height: 1cm;
        max-height: 2480px;
        width: 100%;
        padding: 0;
        min-height: 10rem;
    }

    .conatiner {
        max-height: 1cm;
    }

    .mdi-cursor-move {
        display: none;
    }

}
</style>