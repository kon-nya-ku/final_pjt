<template>
	<div>
    <h1>PMROA</h1>
		<h3>Predict Movie Revenue of Actors</h3>

    <p> 결과 : {{ result }} (달러) </p>

    <h5>Picked Actors</h5>
    <div v-for="pick_actor in pick_actors" :key="pick_actor.id.id" :pick_actor="pick_actor">{{pick_actor.name}}</div>

    <!-- <button @click="resetActor">초기화</button> -->

    <button @click="movieRevenue">확인</button>
    <br>
    <input ref="cursorpredict" type="text" v-model="actor_search" @keyup.enter="actorSearch()" value="search">
    <button @click="actorSearch()">actor_search</button>
    
    <hr>
    <div v-for="actor in AllActors" :key="actor.id" :actor="actor"
    ><p><img :src="`https://image.tmdb.org/t/p/w138_and_h175_face/${actor.profile_path}`" alt="" srcset=""></p>
		<button @click="pickActor(actor)">{{ actor.name }}</button>

		</div>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000'

export default {
  name: 'PredictMovieView',
  data() {
    return {
      pick_actor: null,
      pick_actors:[],
      pick_actors_name: [],
      AllActors: [],
      Actors: [],
      result: null,
      actor_search: null,
      acto: null,
    }
  },
  // created(){
  //   this.getAllActors()
  // },
  // mounted() {
  //   this.startCursor()
  // },
  methods: {
    // getAllActors() {
		// 	axios({
		// 		method:'get',
    //     url:'https://api.themoviedb.org/3/person/popular?language=ko-KR&page=1&api_key=c988dcefc9872e7d8eb4a1b1592fd0c8',
		// 	})
		// 	.then((res) => {
		// 		// console.log(res.data.results)
		// 		this.AllActors = res.data.results
    //   })
    //   .catch((err) => {
    //   console.log(err)
    //   })
		// },
    // resetActor () {
    //   this.pick_actors = null
    //   // location.reload(true)
    // },
    pickActor(id) {
      const pick_actors = this.pick_actors
      // console.log(pick_actors)
      const pick_actor = id
      // console.log(pick_actor)
      // console.log(this.pick_actors)
      if(pick_actors.includes(pick_actor)){
        // alert('이미 선택된 배우입니다')
        const filter_actors = pick_actors.filter((element) => element !== pick_actor)
        this.pick_actors = filter_actors
        // console.log(this.pick_actors)
        // this.pick_actor = null
      } else if (this.pick_actors.length >= 4){
        alert('4명까지만 선택해주세요')
      } else {
        pick_actors.push(pick_actor)
        this.pick_actors=pick_actors
        // console.log(this.pick_actors)
      }

    },
  
    movieRevenue(){
      const pick_actors = this.pick_actors
      const pick_actors_name = this.pick_actors_name
      // console.log(pick_actors)
      for (const pick_actor of pick_actors){
        console.log(pick_actor)
        pick_actors_name.push(pick_actor.name)
      }
      const actors = pick_actors_name
      this.pick_actors = []
      this.pick_actors_name = []
      console.log(actors);
      axios({
        method: 'POST',
        url: `${API_URL}/api/v1/movies/predicts/`,
        data: {
          actors
        }
      })
      .then((res) => {
        // console.log(res)
        // console.log(actors)
        this.pick_actors == null
        this.result = res.data
      })
      .catch((err) => {
        console.log(err)
        this.pick_actors == null
      })

    },
    actorSearch() {
      this.AllActors = []
      const query = this.actor_search
      // console.log(query)
      axios({
        method: 'GET',
        url: `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1&api_key=c988dcefc9872e7d8eb4a1b1592fd0c8&query=${query}`,
        //url 1페이지만 갖고 오도록 해놓음
      })
      .then((res) => {
        // console.log(res.data.results)
        const actos = res.data.results
        const AllActors = this.AllActors
        actos.forEach(element => {
          if (element.popularity>4 ) {
            if (element.known_for_department == "Acting"){
              if(element.profile_path != null){
                // console.log(element)
                AllActors.push(element)
                // console.log(AllActors)
              }
            }
          }
        })
        // console.log(AllActors) 
        this.actor_search = null
        this.Cursorpredict()
        // console.log(AllActors)
      })
      .catch((err) => console.log(err))
    },
    
    Cursorpredict() {
      this.$refs.cursorpredict.focus()
    },
  }
}

</script>