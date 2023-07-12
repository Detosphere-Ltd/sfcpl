import {bindProps} from "@/mixins/branches/singleton"
export default {
    mixins : [bindProps],
    data(){
        return {
            loading : false,
            stats : [],
            failed : false,
            errData : undefined,
            to : undefined,
            from : undefined,
        }
    },


    computed : {
        queryParameters(){
            return `${this.to && this.from ? '&end='+this.to+'&start='+this.from : ''}`
        },
    },

    methods : {
        async getStats(){
            this.loading = true
            this.failed = false
            this.errData = undefined
            await this.$axios.$get(`/statistics/general?branch=${this.branch.uuid}${this.queryParameters}`)
            .then((res)=>{
                this.stats = res.data.amounts
            })
            .catch( err =>{
                this.failed = true
                this.errData = err
            })
            .finally(()=>{
                this.loading = false
            })
        },

        applyDate(payload){
            this.to = this.$moment(payload.endDate).format('DD/MM/YYYY')
            this.from = this.$moment(payload.startDate).format('DD/MM/YYYY')
        },
    },

    watch : {
        async queryParameters(){
            await this.getStats()
        }
    }
}