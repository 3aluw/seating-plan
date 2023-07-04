<template>
    <div class="conatiner ">
        <nav class="flex justify-around mt-12">
            <v-btn variant="text">Home</v-btn>
            <v-btn variant="text">Modify paln</v-btn>
            <v-btn variant="text" @click="showChangePlan = true">change plan</v-btn>
            <ChosePlan v-model="showChangePlan" />
        </nav>

        <div style="position:relative;  margin-inline: 3rem;padding:5rem; min-height: 50rem;" class="mt-10">
            <div v-for="(student, index) in planStore.plans[planStore.currentPlanIndex].tableData" ref="studentRefs"
                :style="draggables[index]?.style"
                style="position: absolute;width:100px; border:black solid 1px; height: 50px">{{ student?.name }} my x :
                {{ draggables[index]?.x }}
            </div>
        </div>
        <div class="action-btns flex justify-around">
            <v-btn color="blue-darken-2" variant="tonal">Undo changes</v-btn>
            <v-btn color="blue-darken-2" variant="tonal">download a screenshot</v-btn>
        </div>

    </div>
</template>
<script setup>
import { usePlanStore } from '~/store/planStore'

const planStore = usePlanStore();


//show component  
const showChangePlan = ref(false)




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

            onEnd(position) {
                let targetXIndex = null;
                let inintialLocation = defineLocation(x);
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
    console.log(studentRefs.value.length / 6)
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

const swapStudents = (fromIndex, toIndex) => {
    if (toIndex >= 0) {
        const temp = planStore.plans[planStore.currentPlanIndex].tableData[fromIndex];
        planStore.plans[planStore.currentPlanIndex].tableData[fromIndex] = planStore.plans[planStore.currentPlanIndex].tableData[toIndex];
        planStore.plans[planStore.currentPlanIndex].tableData[toIndex] = temp;
    }
}


</script>

<style>
/*.playground-cont {
    position: relative;
    background: blue;
    margin-inline: 3rem;
    padding: 5rem;
    min-height: 50vh;

}*/
</style>