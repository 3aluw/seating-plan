<template>
    <div class="conatiner">
        <nav class="flex justify-around">
            <v-btn variant="text">upload a plan</v-btn>
            <v-btn variant="text">Create a new plan</v-btn>
            <v-btn variant="text">support me</v-btn>
        </nav>
        <div class="main-content my-10 flex justify-between px-10 ">
            <div class="fetures flex flex-col">
                <p class="text-2xl px-10 py-5 my-5 ml-20 green-linear">BETTER RESULTS</p>

                <p class="text-2xl px-10 py-5 my-5 ml-10  yellow-linear">MORE FOCUS</p>


                <p class="text-2xl px-10 py-5 my-5 red-linear">LESS DISTRACTION</p>
            </div>
            <div class="traingles flex flex-col">
                <img class="p-5" src="/Polygon-1.svg">
                <img class="p-5" src="Polygon-3.svg">
                <img class="p-5" src="Polygon-2.svg">
            </div>

            <div class="flex justify-start flex-col main-text">
                <p class="text-5xl pt-5">A <span class="text-purple-600">GOOD </span> seating plan is a part of your game
                </p>
                <p class="pt-3"> A well-organized seating plan can help promote engagement and interaction among students
                </p>
            </div>

        </div>
        <div class="flex justify-center"> <button class="call-btn">Create Your plan</button></div>
    </div>
</template>
<style scoped>
.conatiner {
    margin: 0 auto;
    max-width: 80rem;
    min-height: 100vh;
    padding-block: 3rem;
}

.fetures {
    min-width: 40%;
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
}
</style>