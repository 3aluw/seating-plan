<template>
    <div class="conatiner">
 <!--        <nav class="flex justify-around  max-[600px]:flex-col max-[600px]:items-center">
            <NuxtLink to="/playgroundOne"> <v-btn variant="text">playground</v-btn></NuxtLink>

            <v-dialog v-model="UploadDialog" width="auto" theme="dark" min-width="400px">
                <template v-slot:activator="{ props }">
                    <div class="flex justify-center"> <v-btn variant="text" v-bind="props">upload a plan</v-btn>
                    </div>
                </template>
                <UploadPlan @closeDialog="UploadDialog = false" />
            </v-dialog>

            <v-btn @click="dialog = true" variant="text" class="max-[600px]:!hidden">Create a new plan</v-btn>

        </nav> -->

        <div class="main-content my-10 flex justify-between px-10  gap-4">
            <div class="fetures flex flex-col text-center ">
                <p class="text-2xl px-10 py-5 my-5 ml-20 green-linear ">BETTER RESULTS</p>

                <p class="text-2xl px-10 py-5 my-5 ml-10  yellow-linear">MORE FOCUS</p>


                <p class="text-2xl px-10 py-5 my-5 red-linear">LESS DISTRACTION</p>
            </div>
            <div class="traingles flex flex-col justify-evenly max-[500px]:hidden">
                <img class="p-5" src="/Polygon-1.svg">
                <img class="p-5" src="/Polygon-3.svg">
                <img class="p-5" src="/Polygon-2.svg">
            </div>

            <div class="flex justify-start flex-col main-text">
                <p class="text-5xl pt-5">A <span class="text-purple-600">GOOD </span> seating plan is a part of your game
                </p>
                <p class="pt-3"> A well-organized seating plan can help promote engagement and interaction among students
                </p>
            </div>

        </div>

        <div class="text-center">
            <v-dialog v-model="dialog" width="auto" theme="dark">
                <template v-slot:activator="{ props }">
                    <div class="flex justify-center max-[600px]:!hidden"> <button class="call-btn bt-shake" v-bind="props">
                            Create Your
                            plan</button>
                    </div>
                </template>

                <v-card>
                    <v-card-text>
                        <v-fade-transition :hideOnLeave=true>
                            <PlanInfos v-model="planInfos" v-if="step == 1" />
                        </v-fade-transition>

                        <v-fade-transition :hideOnLeave=true>
                            <AddStudents v-model="namesTable" v-if="step == 2" />
                        </v-fade-transition>

                        <v-fade-transition :hideOnLeave=true>
                            <ConfirmPlan :planInfos="planInfos" :namesTable="namesTable" @changeStep="changeStep"
                                v-if="step == 3" />
                        </v-fade-transition>


                        <!--Form navigation buttons-->
                        <div class="flex justify-center gap-4">
                            <v-btn prepend-icon="mdi:mdi-arrow-left" variant="outlined" color="white" :disabled="step == 1"
                                @click="step -= 1">BACK</v-btn>
                            <v-btn append-icon="$next" variant="outlined" color="white" v-if="step < 3" @click="step += 1"
                                :disabled="disableNextButton">NEXT</v-btn>
                            <NuxtLink to="/playground"> <v-btn append-icon="$next" variant="flat" color="green-darken-2"
                                    v-if="step == 3" @click="plansCreator">Finnish</v-btn></NuxtLink>

                        </div>

                    </v-card-text>
                </v-card>
            </v-dialog>
        </div>

    </div>
</template>

<script setup>
import { usePlanStore } from '~/store/planStore'
const PlanStore = usePlanStore();


//Emited Data from child components :
//(PlanInfos comp)
let planInfos = ref({
    planName: "",
    description: '',
    seatType: '',
})
// AddStudents comp
let namesTable = ref({
    criteriaOneTitle: "",
    tableData: [],
    numberOfRows: 2,
})



//form steps
let step = ref(1)
//Enable NEXT button
const disableNextButton = computed(() => {
    if (step.value === 1 && isFormComplete(planInfos.value)) { return false }
    else if (step.value === 2 && namesTable.value.tableData.length > 4) { return false }
    return true
}
)
const isFormComplete = (obj) => {
    return Object.keys(obj).every(key => obj[key].length > 0)
}
//listen to modify emits from the confirmPlan component 
const changeStep = (toStep) => {
    step.value = toStep
}

//create the plan 
const plansCreator = () => {
    if (!namesTable.value.criteriaOneTitle) namesTable.value.criteriaOneTitle = "A criteria"
    const { planName, description, seatType } = planInfos.value;


    const { tableData, criteriaOneTitle,numberOfRows } = namesTable.value
    PlanStore.plansCreator(planName, description, seatType, criteriaOneTitle, tableData,numberOfRows)


}



//dialog logic
let dialog = ref(false);
let UploadDialog = ref(false);
//delete entered data after closing the dialog
watch(dialog, () => {
    if (dialog.value === false) {
        Object.keys(planInfos.value).forEach(key => planInfos.value[key] = "");
        namesTable.value.criteriaOneTitle = ""
        namesTable.value.tableData = [];
        step.value = 1
    }

})
</script>
<style scoped>
.conatiner {
    margin: 0 auto;
    max-width: 80rem;
    min-height: 100vh;
    padding-block: 3rem;
}

.fetures {

    font-family: 'Inter';
    font-weight: 600;
}

.green-linear {
    max-width: 25rem;
    background: linear-gradient(270deg, #8FFF8C -5.93%, rgba(143, 255, 140, 0.22) 104.71%);
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 17px;
}

.yellow-linear {
    max-width: 25rem;
    background: linear-gradient(270deg, #FDFF8C -5.93%, rgba(252, 255, 143, 0.22) 104.71%);
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 17px;
}

.red-linear {
    max-width: 25rem;
    background: linear-gradient(270deg, #FF9797 -5.93%, rgba(255, 151, 151, 0.34) 104.71%);
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 17px;
}

.main-text {
    max-width: 400px;
}

.main-text>.text-5xl {
    font-family: 'Inter';
    font-weight: 700;
    text-align: center;
}

.call-btn {
    font-family: 'Inter';
    font-weight: 700;
    background: #B5EAFF;
    border-radius: 15px;
    padding: 2rem;
    font-size: 3rem;
    border: 2px solid black;
    box-shadow: 8px 4px 4px rgba(0, 0, 0, 0.25);
}

.bt-shake {
    position: relative;
    animation: shakeMe 4s infinite ease-in-out;
}

@keyframes shakeMe {
    0% {
        transform: rotate(0deg);
    }

    20% {
        transform: rotate(3deg);
    }

    40% {
        transform: rotate(-3deg);
    }

    60% {
        transform: rotate(3deg);
    }

    80% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(0);
    }
}

/* an other animation
@keyframes wobble {
    0% {
        transform: none;
        transform-origin: center;
    }

    15% {
        transform: translate3d(0, -25%, 0) rotate3d(0, 0, 1, -5deg);
        transform-origin: center;
    }

    30% {
        transform: translate3d(0, 20%, 0) rotate3d(0, 0, 1, 3deg);
        transform-origin: center;
    }

    45% {
        transform: translate3d(0, -15%, 0) rotate3d(0, 0, 1, -3deg);
        transform-origin: center;
    }

    60% {
        transform: translate3d(0, 10%, 0) rotate3d(0, 0, 1, 2deg);
        transform-origin: center;
    }

    75% {
        transform: translate3d(0, -5%, 0) rotate3d(0, 0, 1, -1deg);
        transform-origin: center;
    }

    100% {
        transform: none;
        transform-origin: center;
    }
}*/

/*Form */
.v-card-text {
    background: #1B1C24;
    color: #A8A6A7;
}

@media screen and (max-width: 900px) {
    .px-10 {
        padding-right: 10px !important;
        padding-left: 10px !important;
    }

    .ml-10 {
        margin-left: 20px !important;
    }

    .text-5xl {
        font-size: 2.5rem;
        line-height: 1;
    }

    .main-text {
        max-width: 50%
    }
}
</style>