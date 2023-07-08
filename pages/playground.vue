<template>
    <div class="conatiner ">
        <nav class=" navbar flex justify-around mt-12">
            <v-btn variant="text">Home</v-btn>
            <v-btn variant="text" @click="showModifyPlan = true">Modify paln</v-btn>
            <ModifyPlan v-model="showModifyPlan" />
            <v-btn variant="text" @click="showChangePlan = true">change plan</v-btn>
            <ChosePlan v-model="showChangePlan" />
        </nav>

        <div id="print" class="playground-cont mt-10">
            <div class="relative student-rect"
                v-for="(student, index) in   planStore.plans[planStore.currentPlanIndex].tableData  " ref="studentRefs"
                :style="draggables[index]?.style" :class="{ 'overlappedItem': index === overlappedItem }"
                style="position: absolute;width:100px; border:black solid 1px; height: 50px">
                <p class="h-full w-full text-center">{{ student?.name }}</p>
                <i class="top-0 moving-btn mdi-cursor-move mdi v-icon notranslate v-theme--light v-icon--size-default"
                    aria-hidden="true"></i>
            </div>
        </div>

        <div class="action-btns flex justify-around">
            <v-btn color="blue-darken-2" variant="tonal" @click="undoChanges">Undo changes</v-btn>
            <v-btn color="blue-darken-2" variant="tonal" @click="printPlan">Print</v-btn>
        </div>

    </div>
</template>
<script setup>
import { usePlanStore } from '~/store/planStore'

const planStore = usePlanStore();


//show component  
const showChangePlan = ref(false)
const showModifyPlan = ref(false)

//overlapped item to change its background
let overlappedItem = ref(null)


const XObj = ref({
    //Object that has x values (assuming there are three rows in classrom )Even: +110 ; odd : +120
    0: 0,
    1: 110,
    2: 230,
    3: 340,
    4: 460,
    5: 570,
})

const studentRefs = ref([])
const draggables = ref([])

onMounted(() => {
    for (let x in planStore.plans[planStore.currentPlanIndex].tableData) {
        draggables.value.push(useDraggable(studentRefs.value[x], {
            initialValue: defineLocation(x),

            onStart(position) {
                //fixes coordinates snap when start dragging
                position.y += 123.984375
                position.x += 47.98828125

            },
            onMove(position) {
                let targetXIndex = null;

                //find the x index of the target location
                let i = 0;
                while (i <= 5) {
                    if (position.x + 50 - XObj.value[i] < 100) { targetXIndex = i; break }
                    i++
                }
                const toIndex = FindNdOverlapingItem(x, targetXIndex)
                overlappedItem.value = toIndex

            },
            onEnd(position) {
                let targetXIndex = null;
                let inintialLocation = defineLocation(x);
                //find the x index of the target location
                let i = 0;
                while (i <= 5) {
                    if (position.x + 50 - XObj.value[i] < 100) { targetXIndex = i; break }
                    i++
                }
                const toIndex = FindNdOverlapingItem(x, targetXIndex)
                console.log(FindNdOverlapingItem(x, targetXIndex), 5)
                position.x = inintialLocation.x;
                position.y = inintialLocation.y;

                swapStudents(x, toIndex)

            }
        }));
    }
})


const defineLocation = (index) => {
    const yIndex = Math.floor(index / 6)
    const xIndex = index - 6 * yIndex

    const x = XObj.value[xIndex]
    const y = (yIndex) * 60
    return { x: x, y: y }
}

const FindNdOverlapingItem = (movingItemIndex, toXIndex) => {
    const rect1 = studentRefs.value[movingItemIndex].getBoundingClientRect()

    for (let i = 0; i < Math.ceil(studentRefs.value.length / 6); i++) {
        const rect2 = studentRefs.value[toXIndex + (i * 6)]?.getBoundingClientRect();

        if (rect2 && !(
            rect1.top > rect2.bottom ||
            rect1.right < rect2.left ||
            rect1.bottom < rect2.top ||
            rect1.left > rect2.right
        ) && !(movingItemIndex == toXIndex + (i * 6))) { return toXIndex + (i * 6); }
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

const undoChanges = () => {
    planStore.plans[planStore.currentPlanIndex].tableData = planStore.clonedTableData.map(a => { return { ...a } })
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
.playground-cont {
    position: relative;
    margin-inline: 3rem;
    padding: 5rem;
    min-height: 30rem;

}

.moving-btn {
    position: absolute;
    padding: 0;
    cursor: move;
    pointer-events: auto;
}

.student-rect {
    pointer-events: none;
}

.overlappedItem {
    background: yellow;
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

}
</style>