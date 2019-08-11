


// getters 进一步处理state 
export default {
    mvs(state){
        return state.mv.filter((m,index)=>index%2==0);
    },
    // goods(state){return state.lists}
}