<template>
    <div class="playground-container" :class="{ 'dark-playground-container': darkMode }">

        <nav class="navbar flex justify-around py-8 flex-wrap">
            <NuxtLink to="/"> <v-btn variant="plain">Home</v-btn></NuxtLink>

            <v-dialog v-model="UploadDialog" width="auto" min-width="400px">
                <template v-slot:activator="{ props }">

                    <v-btn variant="plain" v-bind="props">upload a plan</v-btn>

                </template>

                <UploadPlan @closeDialog="UploadDialog = false" />
            </v-dialog>

            <v-btn variant="plain" @click="showChangePlan = true">Change plan</v-btn>

        </nav>

        <div class="playground-wrapper">
            <!--dialogs-->
            <ModifyPlan v-model="showModifyPlan" v-if="showModifyPlan" />
            <ChosePlan v-model="showChangePlan" />
            <!--playground toolbar-->

            <v-toolbar density="compact" :color="!darkMode ? 'blue-darken-1' : 'blue-darken-4 '">
                <!-- actions menu -->
                <v-menu open-on-hover>
                    <template v-slot:activator="{ props }">
                        <v-btn class="print:!hidden" variant="text" dark v-bind="props"
                            prepend-icon="mdi-dots-horizontal">
                            <span class="max-[500px]:!hidden">actions</span>
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item> <v-btn prepend-icon="mdi-printer" color="blue-darken-4" variant="text"
                                @click="printPlan" class="w-full !justify-between">Print</v-btn></v-list-item>

                        <v-list-item> <v-btn prepend-icon=" mdi-download " color="blue-darken-4" variant="text"
                                @click="planStore.downloadPlan"> Download plan </v-btn></v-list-item>
                    </v-list>
                </v-menu>

                <!-- modify menu -->
                <v-menu open-on-hover>
                    <template class="print:hidden" v-slot:activator="{ props }">
                        <v-btn dark v-bind="props" prepend-icon="mdi-cog" class=" print:!hidden">
                            <span class="max-[500px]:!hidden">modify </span>
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
                            <v-btn prepend-icon="mdi-auto-fix" color="blue-darken-4" variant="text"
                                class="w-full !justify-between" @click="planStore.fairDistribute" :disabled="!currentPlan.isSortingCriteriaAllowed">smart plan</v-btn>
                        </v-list-item>
                        <v-list-item>
                            <v-btn prepend-icon="mdi-sort-numeric-ascending" color="blue-darken-4" variant="text"
                                class="w-full !justify-between" @click="planStore.sortItems('asc')" :disabled="!currentPlan.isSortingCriteriaAllowed">sort(asc)</v-btn>
                        </v-list-item>
                        <v-list-item>
                            <v-btn prepend-icon="mdi-sort-numeric-descending" color="blue-darken-4" variant="text"
                                class="w-full !justify-between" @click="planStore.sortItems('desc')" :disabled="!currentPlan.isSortingCriteriaAllowed">sort(desc)</v-btn>
                        </v-list-item>
                        <v-list-item>
                            <v-btn prepend-icon="mdi-undo" color="blue-darken-4" variant="text"
                                @click="planStore.undoChanges">Reset plan</v-btn>
                        </v-list-item>

                    </v-list>
                </v-menu>

                <v-slider class="print:!hidden" v-model="zoom" append-icon="mdi-magnify-plus-outline"
                    prepend-icon="mdi-magnify-minus-outline" step="10" @click:append="zoom += 10"
                    @click:prepend="zoom -= 10" hide-details></v-slider>
                <v-spacer class="max-[500px]:!hidden"></v-spacer>
                <v-toolbar-title class="text-center !font-bold">{{ planStore.plans[planStore.currentPlanIndex].planName
                }}</v-toolbar-title>
                <v-spacer class="max-[500px]:!hidden"></v-spacer>
                <v-btn prepend-icon="mdi-theme-light-dark" class="max-[600px]:!hidden print:!hidden"
                    @click="darkMode = !darkMode">
                    Dark/light mode
                </v-btn>
            </v-toolbar>

            <div id="print" :style="zoomStyleObject" :class="{ 'dark-playground-cont': darkMode }"
                class="playground-cont relative grid gap-8 overflow-scroll shadow-lg mb-5 px-4 py-20"
                ref="playgroundRef">
                <div class="front absolute">Front</div>
                <div class="grid " :class="columnClass"
                    v-for="(column, index) in planStore.plans[planStore.currentPlanIndex].planScheme">

                    <div :class="{ 'dark-student-box': darkMode }"
                        class="student-box w-28 h-14 p-2 text-sm sm:text-base sm:p-6 sm:w-40 sm:h-20  cursor-move"
                        v-for="student in column" :key="student.id" :data-id="student.id">
                        <span class="sm:font-bold">{{student.name}}</span> <br> <small class="text-xs hidden sm:inline">- {{ student.fieldOne }} -</small></div>
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
const UploadDialog = ref(false)




//generate the zoom value
const zoom = ref(100)
const zoomStyleObject = computed(() => {
    return {
        zoom: `${zoom.value}%`,
    }
})

//styling
const darkMode = ref(false)

const itemWidth = ref(150)
const itemHeight = ref(50)
const singleMargin = ref(20)
//overlapped item to change its background
let overlappedItem = ref(null)






//Rows and pairs logic
const placesPerRow = computed(() => {
    const { numberOfRows, seatType } = currentPlan.value
    const numberOfStudents = currentPlan.value.tableData.length
    const placesPerRow = Math.ceil(numberOfStudents / numberOfRows)
    return seatType == 0 && placesPerRow % 2 ? placesPerRow + 1 : placesPerRow
})

const printPlan = (zoom) => {
    setTimeout(() => window.print(), 1000)

}
</script>

<style>
/*deleting a  weird teleport item */
.navbar>div {
    display: none;
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

.dark-playground-container {
    background: #121212;
    color: white;
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
    min-height: 20rem;
    position: relative;
    background: #EAF2F8;

}

.dark-playground-cont {
    background: #1C1C1C;
    color: white;
}

.dark-playground-container>.navbar {
    color: white;
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
    background-color: #1E6BA8;
    color: #F7F9F9;
    text-align: center;
    border-radius: 1px;
    white-space: normal;
    /* allow text to wrap */
    word-wrap: break-word;
    /* break long words if needed */
    /* optional: control how wide each box can grow */
    box-sizing: border-box;
    text-overflow: ellipsis;
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}

.dark-student-box {
    background-color: #1565C0;
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(156, 156, 156, 0.23) 0px 6px 6px;
}

.draggable--over {
    border: 1px dashed black;
    background: #a5c4dc;
    color: black;
}

.draggable-mirror {
    opacity: 0.5;
    color: black;
}

.front,
.back {
    font-size: 2rem;
    border: 1px dashed;
    font-weight: 500;
    padding-inline: 1rem;
    padding-block: 0.2rem;
    color: inherit;
    left: 50%;
}

.front {
    border-top: none;
}

.back {
    bottom: 0;
    border-bottom: none;
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


    #print,
    #print * {

        overflow: visible;
    }

    .student-box {
        font-weight: bold;
        font-size: 1.2rem;
        width: 12rem;
        height: 6rem;
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