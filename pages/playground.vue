<template>
    <div class="conatiner">

        <!--        <nav class="navbar flex justify-around mt-12">
            <NuxtLink to="/"> <v-btn variant="plain">Home</v-btn></NuxtLink>

            <v-dialog v-model="UploadDialog" width="auto" theme="dark" min-width="400px">
                <template v-slot:activator="{ props }">

                    <v-btn variant="plain" v-bind="props">upload a plan</v-btn>

                </template>

<UploadPlan @closeDialog="UploadDialog = false" />
</v-dialog>

<v-btn variant="plain" @click="showChangePlan = true">Change plan</v-btn>

</nav> -->

        <div class="playground-wrapper">
            <!--dialogs-->
            <!--             <ModifyPlan v-model="showModifyPlan" />
            <ChosePlan v-model="showChangePlan" />
            <PrintDialog v-model="showPrintDialog" @printEmit="printPlan" class='printDialog' /> -->
            <!--playground toolbar-->
            <!--            <v-card color="grey-lighten-4" flat rounded="0">

                <v-toolbar density="compact" color="blue-darken-1">
                    <v-menu open-on-hover>
                        <template v-slot:activator="{ props }">
                            <v-btn dark v-bind="props" prepend-icon="mdi-dots-horizontal">
                                <p class="max-[500px]:!hidden">actions</p>
                            </v-btn>
                        </template>

                        <v-list>
                            <v-list-item> <v-btn prepend-icon="mdi-printer" color="blue-darken-4" variant="text"
                                    @click="showPrintDialog = true"
                                    class="w-full !justify-between">Print</v-btn></v-list-item>

                            <v-list-item> <v-btn prepend-icon=" mdi-download " color="blue-darken-4" variant="text"
                                    @click="planStore.downloadPlan"> Download plan </v-btn></v-list-item>
                        </v-list>
                    </v-menu>


                    <v-menu open-on-hover>
                        <template v-slot:activator="{ props }">
                            <v-btn dark v-bind="props" prepend-icon="mdi-cog" class="max-[600px]:!hidden">
                                modify
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-btn prepend-icon="mdi-file-edit-outline" color="blue-darken-4" variant="text"
                                    class="w-full !justify-between" @click="showModifyPlan = true">modify plan</v-btn>
                            </v-list-item>
                            <v-list-item>
                                <v-btn prepend-icon="mdi-autorenew" color="blue-darken-4" variant="text"
                                    class="w-full !justify-between" @click="planStore.shufflePlan">randomize</v-btn>
                            </v-list-item>
                            <v-list-item>
                                <v-btn prepend-icon="mdi-undo" color="blue-darken-4" variant="text"
                                    @click="planStore.undoChanges">Undo changes</v-btn>
                            </v-list-item>

                        </v-list>
                    </v-menu>

                    <v-slider v-model="zoom" append-icon="mdi-magnify-plus-outline" prepend-icon="mdi-magnify-minus-outline"
                        step="10" @click:append="zoom += 10" @click:prepend="zoom -= 10" class="min-[600px]:!hidden"
                        hide-details></v-slider>
                    <v-spacer></v-spacer>
                    <v-toolbar-title>{{ planStore.plans[planStore.currentPlanIndex].planName }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn prepend-icon="mdi-theme-light-dark" class="max-[600px]:!hidden" @click="Darkmode = !Darkmode">
                        Dark/light mode
                    </v-btn>
                </v-toolbar>
            </v-card> -->

            <!-- OLD PLAYGROUND -->
            <!-- <div id="print" ref="playgroundRef" class="playground-cont  shadow-lg mt-10 mb-5 ">
                <div class="relative playground-item flex justify-center align-center" v-show="showPlayground"
                    v-for="(student, index) in planStore.plans[planStore.currentPlanIndex].tableData" ref="studentRefs"
                    :style="draggables[index]?.style" :class="{
                        'overlappedItem': index === overlappedItem,
                    }">
                    <p class="text-center">{{ student?.name }} </p>


                    <i class="top-0 moving-btn mdi-cursor-move mdi v-icon notranslate v-theme--light v-icon--size-default"
                        aria-hidden="true"></i>
                    <i v-if="student.fieldOne"
                        class="bottom-0 right-0 info-icon mdi-information-outline fa-1x mdi notranslate v-theme--light v-icon--size-default"
                        aria-hidden="true"> <v-tooltip activator="parent" location="bottom">{{ student.fieldOne }}
                        </v-tooltip></i>
                </div>
            </div> -->
            <div id="print" class="playground-cont relative grid gap-8 overflow-scroll shadow-lg mt-10 mb-5 px-4 py-20"
                ref="playgroundRef">
                <div class="front absolute">Front</div>
                <div class="grid" :class="columnClass"
                    v-for="(column, index) in planStore.plans[planStore.currentPlanIndex].planScheme">

                    <div class="student-box font-bold cursor-move" v-for="student in column" :key="student.id"
                        :data-id="student.id">{{
                            student.name
                        }} </div>
                </div>
                <div class="back absolute">Back</div>
            </div>
        </div>


    </div>
</template>
<script setup>

import { usePlanStore } from '~/store/planStore'
const planStore = usePlanStore();

const currentPlan = computed(() => planStore.plans[planStore.currentPlanIndex])
const columnClass = computed(() => currentPlan.value.seatType === "pairs" ? "pairs-column" : "individual-column")
//used refs
const studentRefs = ref([])
const draggables = ref([])
const playgroundRef = ref(null)
onMounted(async () => {
    if (import.meta.client) {
        const { Draggable } = await import('@shopify/draggable')
        if (playgroundRef.value) {
            const draggable = new Draggable(playgroundRef.value, {
                draggable: '.student-box',

            })
            let targetElement = undefined;

            draggable.on('drag:over', (event) => {
                targetElement = event.over;
            });

            draggable.on('drag:out', (event) => {
                if (event.over === targetElement) {
                    targetElement = undefined;
                }
            });

            draggable.on('drag:stop', (event) => {
                const draggedElement = event.source;
                if (targetElement) swapStudents(Number(draggedElement.dataset.id), Number(targetElement.dataset.id))
            })
        }
    }
})

const swapStudents = (draggedElementId, targetElementId) => {
    const planScheme = currentPlan.value.planScheme;
    // Find the indices of the dragged and target elements
    const draggedColumnIndex = planScheme.findIndex(array => array.some(student => student.id === draggedElementId))
    const draggedStudentIndex = planScheme[draggedColumnIndex].findIndex((student) => student.id == draggedElementId)
    const targetColumnIndex = planScheme.findIndex((array, index) => array.some(student => student.id === targetElementId))
    const targetStudentIndex = planScheme[targetColumnIndex].findIndex((student) => student.id == targetElementId)
    // Swap them directly
    const temp = planScheme[draggedColumnIndex][draggedStudentIndex];
    planScheme[draggedColumnIndex][draggedStudentIndex] = planScheme[targetColumnIndex][targetStudentIndex];
    planScheme[targetColumnIndex][targetStudentIndex] = temp;
}
//show components
const showChangePlan = ref(false)
const showModifyPlan = ref(false)
const showPlayground = ref(false)
const showPrintDialog = ref(false)
const UploadDialog = ref(false)




//generate the zoom value
const zoom = ref(100)
const usedZoom = computed(() => planStore.viewMode ? `${zoom.value}%` : '100%')
const fontZoom = computed(() => planStore.viewMode ? `${100 + (100 - zoom.value)}%` : '100%')

let usedprintZoom = ref('70%')


//styling
const Darkmode = ref(false)
const playgroundMode = ref([
    {
        bg: "url('/naturalblack.png')",
        border: "white solid 1px",
        outlineColor: "rgb(16 21 27)",
        color: "#e5e7eb"
    },
    {
        bg: "url('/dot-grid.png')",
        border: "black solid 1px",
        outlineColor: "white",
        color: "black"
    },
])
const usedStyles = computed(() => {
    return Darkmode.value === false ? playgroundMode.value[1] : playgroundMode.value[0]
})
const itemWidth = ref(150)
const itemHeight = ref(50)
const singleMargin = ref(20)
//overlapped item to change its background
let overlappedItem = ref(null)






//U-shape logic
/* const studentsNumberBaseLine = computed(() => Math.ceil(planStore.plans[planStore.currentPlanIndex].tableData.length / 3))
const studentsnumberLeftLine = computed(() => Math.ceil((planStore.plans[planStore.currentPlanIndex].tableData.length - studentsNumberBaseLine.value) / 2))
const studentsNumberRightLine = computed(() => planStore.plans[planStore.currentPlanIndex].tableData.length - studentsNumberBaseLine.value - studentsnumberLeftLine.value)
const rightLineStartIndex = computed(() => studentsnumberLeftLine.value + studentsNumberBaseLine.value)
const baseLineStartIndex = computed(() => rightLineStartIndex.value - studentsNumberBaseLine.value) */

//  roatate items if it is in the left or right line U-Shape
/* const rotateItem = (index) => {
    if (planStore.plans[planStore.currentPlanIndex].seatType !== "2") return
    return index < baseLineStartIndex.value ? 'left' : index > rightLineStartIndex.value - 1 ? "right" : false
} */




//Rows and pairs logic
const placesPerRow = computed(() => {
    const { numberOfRows, seatType } = currentPlan.value
    const numberOfStudents = currentPlan.value.tableData.length
    const placesPerRow = Math.ceil(numberOfStudents / numberOfRows)
    return seatType == 0 && placesPerRow % 2 ? placesPerRow + 1 : placesPerRow
})
const fillBlanks = () => {
    const numberOfStudents = currentPlan.value.tableData.length
    const { numberOfRows, seatType } = currentPlan.value
    const reminderOfStudents = numberOfStudents % numberOfRows;
}
/* //generate items locations on the X-axis
const XObj = ref([0])
const generateXObj = () => {
    XObj.value = [0]
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

        const baseLineStartX = itemHeight.value
        const leftLineStartX = baseLineStartX + itemWidth.value * studentsNumberBaseLine.value
        XObj.value.push(baseLineStartX, leftLineStartX)
    }

}

 */

/* 
//auto scroll implementation
import { useMouseInElement, useScroll } from '@vueuse/core'
let elHeight = null
let elWidth = null
let { x: scrollX, y: scrollY } = useScroll(playgroundRef)
const mouse = reactive(useMouseInElement(playgroundRef))

const movingItem = ref(null)

const generateDraggables = () => {
    //dragables logic
    draggables.value = []
    for (let x in planStore.plans[planStore.currentPlanIndex].tableData) {
        draggables.value.push(useDraggable(studentRefs.value[x], {
            initialValue: defineLocation(x),
            containerElement: playgroundRef,
            onStart(position) {
                //fixes coordinates snap when start dragging
                //  position.y += (playgroundRef.value.getBoundingClientRect().top - playgroundRef.value.scrollTop)
                // position.x += (playgroundRef.value.getBoundingClientRect().left - playgroundRef.value.scrollLeft);
                movingItem.value = x
            },
            onMove(position) {
                scrollYFn()
                scrollXFn()


                //check if we aren't using U-shape type
                if (planStore.plans[planStore.currentPlanIndex].seatType !== "2") {
                    //find the overlapped item to change its style
                    let targetXIndex = findTargetXIndex(position);
                    const toIndex = FindNdOverlapingItem(x, targetXIndex)
                    overlappedItem.value = toIndex
                }
                //if the plan is U-shape
                else {
                    let targetXIndex = findUTargetXIndex(position);
                    const toIndex = FindNdOverlapingUItem(x, targetXIndex)
                    overlappedItem.value = toIndex
                }

            },
            onEnd(position) {
                //check if we aren't using U-shape type
                if (planStore.plans[planStore.currentPlanIndex].seatType !== "2") {
                    //find the x index of the target location
                    let targetXIndex = findTargetXIndex(position);
                    //save th initial location so the item returns to it
                    let inintialLocation = defineLocation(x);
                    position.x = inintialLocation.x;
                    position.y = inintialLocation.y;
                    //find the index of the target item and swap them
                    const toIndex = FindNdOverlapingItem(x, targetXIndex)

                    swapStudents(x, toIndex)
                }
                else {
                    //find the x index of the target location
                    let targetXIndex = findUTargetXIndex(position);
                    //save th initial location so the item returns to it
                    let inintialLocation = defineULocation(x);
                    position.x = inintialLocation.x;
                    position.y = inintialLocation.y;
                    //find the index of the target item and swap them
                    const toIndex = FindNdOverlapingUItem(x, targetXIndex)
                    swapStudents(x, toIndex)
                }

                //to reset teh styling of the overlapped item
                overlappedItem.value = null



            }
        }));
    }
}
//regenerate plan when the plan is changed
watch(() => planStore.currentPlanIndex, () => { generateXObj(); generateDraggables() })

onMounted(() => {
    //calculate the demenstions of the used container (helps on auto scrolling)
    elWidth = getComputedStyle(playgroundRef.value).width
    elHeight = getComputedStyle(playgroundRef.value).height

    generateXObj();
    generateDraggables()

    showPlayground.value = true

})

const scrollYFn = () => {

    if (mouse.elementY > (parseFloat(elHeight) - 50)) {
        scrollY.value += 10

        return 'plus'
    }
    else if (mouse.elementY < 50) {
        scrollY.value -= 10

        return 'minus'
    }
}
const scrollXFn = () => {

    //scroll X
    if (mouse.elementX > (parseFloat(elWidth) - 50)) {
        scrollX.value += 10

    }
    else if (mouse.elementX < 50) {
        scrollX.value -= 10
    }
}






//rows and pairs logic
const defineLocation = (index) => {
    //check if we aren't using U-shape type
    if (planStore.plans[planStore.currentPlanIndex].seatType !== "2") {
        const yIndex = Math.floor(index / studentsPerRow.value)
        const xIndex = index - studentsPerRow.value * yIndex

        const x = XObj.value[xIndex]
        const y = (yIndex) * 60
        return { x: x, y: y }
    }
    //if the plan is U-shape
    else {
        return defineULocation(index)
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


// U-shape logic

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

const findUTargetXIndex = (position) => {
    const x = position.x
    if (x < XObj.value[1]) { return 0 }
    else if ((x + itemHeight.value) < XObj.value[2]) {
        return Math.floor(baseLineStartIndex.value + (x - XObj.value[1]) / itemWidth.value)
    }
    else {
        return rightLineStartIndex.value
    }

}

const FindNdOverlapingUItem = (movingItemIndex, toXIndex) => {
    const rect1 = studentRefs.value[movingItemIndex].getBoundingClientRect();
    //left line
    if (toXIndex == 0) {
        for (let i = 0; i < studentsnumberLeftLine.value; i++) {
            const rect2 = studentRefs.value[i]?.getBoundingClientRect();

            if (areItemsOverlaping(rect1, rect2) && !(movingItemIndex == i))
                return i
        }
    }
    // base line
    else if (toXIndex < rightLineStartIndex.value) {
        const rect2 = studentRefs.value[toXIndex].getBoundingClientRect();
        rect2.x += itemHeight.value
        if (areItemsOverlaping(rect1, rect2) && !(movingItemIndex == toXIndex)) return toXIndex
    }
    //right line
    else if (toXIndex == rightLineStartIndex.value) {
        for (let i = 0; i < studentsNumberRightLine.value; i++) {
            const rect2 = studentRefs.value[i + rightLineStartIndex.value].getBoundingClientRect();


            if (areItemsOverlaping(rect1, rect2) && !(movingItemIndex == i + rightLineStartIndex.value)) return i + rightLineStartIndex.value;

        }
    }
}


const areItemsOverlaping = (rect1, rect2) => {
    if (rect2 && !(
        rect1.top > rect2.bottom ||
        rect1.right < rect2.left ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right
    )) {
        return true
    }
}

const swapStudents = (fromIndex, toIndex) => {
    if (toIndex >= 0) {
        const temp = planStore.plans[planStore.currentPlanIndex].tableData[fromIndex];
        planStore.plans[planStore.currentPlanIndex].tableData[fromIndex] = planStore.plans[planStore.currentPlanIndex].tableData[toIndex];
        planStore.plans[planStore.currentPlanIndex].tableData[toIndex] = temp;
    }
}
 */

const printPlan = (zoom) => {
    usedprintZoom.value = zoom
    setTimeout(() => window.print(), 1000)

}
</script>

<style>
/*deleting a  weird teleport item */
.navbar>div {
    display: none;
}

.v-toolbar-title {
    flex-grow: 2;
}

.v-list-item {
    padding-inline: 0 !important;
}


.playground-wrapper {
    /*     margin-inline: 2rem;
    background: v-bind('usedStyles.bg');
    outline-color: v-bind('usedStyles.outlineColor');
    padding: 2rem;
    background-repeat: repeat; */
}

.vertical-view {
    /* To apply column under the other in small devices */
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr))
}

.playground-cont {
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    gap: 2rem;
    overflow: scroll;
    margin-inline: 1rem;
    min-height: 20rem;
    position: relative;
    background: #EAF2F8;

}

.pairs-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.7rem;
}

.individual-column {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.7rem;
}

.student-box {
    background-color: #2980B9;
    color: #F7F9F9;
    padding: 20px;
    text-align: center;
    border-radius: 1px;
    white-space: normal;
    /* allow text to wrap */
    word-wrap: break-word;
    /* break long words if needed */
    width: 100%;
    width: 10rem;
    height: 5rem;
    /* optional: control how wide each box can grow */
    box-sizing: border-box;
    text-overflow: ellipsis;
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}

.draggable--over {
    border: 1px dashed white;
    background: #bfd9ea;
    color: black;
}

.draggable-mirror {
    opacity: 0.5;
    color: black;
}

.front,
.back {
    font-size: 2rem;
    border: 1px dashed black;
    font-weight: 500;
    padding-inline: 1rem;
    padding-block: 0.2rem;
    color: black;
    left: 50%;
}
.front{
    border-top: none ;
}
.back {
    bottom: 0;
    border-bottom: none;
}

.moving-btn {
    position: absolute;
    left: 0;
    top: 0;
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
    border: v-bind('usedStyles.border');
    height: 50px;
    color: v-bind('usedStyles.color');
    zoom: v-bind('usedZoom');
}

.playground-item>p {
    zoom: v-bind(fontZoom);
}

.UShapeLeftRotatedItem {
    pointer-events: none;
    width: 50px;
    height: 150px;
}

.UShapeRightRotatedItem {
    pointer-events: none;
    width: 50px;
    height: 150px;
}

.overlappedItem {
    border: 1px dashed gray;
    opacity: 0.8;
}

.playground-cont::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    /* Width of the scrollbar */
}

.playground-cont::-webkit-scrollbar-track {
    background-color: transparent;
    /* Color of the scrollbar track */
    margin-block: 15px;
}

.playground-cont::-webkit-scrollbar-thumb {
    background-color: rgb(104, 103, 103);
    /* Color of the scrollbar thumb */
    border-radius: 5px;
}



@media print {

    .action-btns,
    .navbar,
    .playground-wrapper>.v-card,
    .v-list,
    .v-card,
    .printDialog {
        display: none;
    }

    .playground-wrapper {
        padding: 0;
        margin-left: 0;
    }

    #print,
    #print * {
        padding: 0px;
        zoom: v-bind('usedprintZoom');
        font-size: 1.5rem;
        overflow: visible;

    }

    #print {
        margin-top: -400px;
    }

    .mdi-cursor-move {
        display: none;
    }


}

@media screen and (max-width: 640px) {
    .mdi-cursor-move {
        display: none !important;
    }

    .playground-wrapper {
        margin-inline: 0;
    }
}
</style>