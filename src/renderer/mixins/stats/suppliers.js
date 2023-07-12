export default {
    data(){
        return {
            loading : false,
            stats : [],
            failed : false,
            errData : undefined,
            order_by : 'amount_outstanding',
            direction : 'desc',

        }
    },

    computed : {
        orderables(){
            return [
                {value : 'cost_price', text : 'Cost Price'},
                {value : 'quantity', text : 'Quantity'},
                {value : 'discount_received', text : 'Discount Received'},
            // {value : 'amount_paid', text : 'Amount Paid'},
                {value : 'amount_outstanding', text : 'Outstanding Amount'},
                ]
        },


        sortables(){
            return [
                {value : 'desc', text : 'Descending Order'},
                {value : 'asc', text : 'Ascending Order'},
                ]
        }, 

        queryParameters(){
            return `
            ${this.order_by ? '&order_by='+this.order_by : ''}
            ${this.direction ? '&direction='+this.direction : ''}
            `
        },
    },

    methods : {
        async getStats(){
            this.loading = true
            this.failed = false
            this.errData = undefined
            await this.$axios.$get(`/statistics/suppliers?${this.queryParameters}`)
            .then((res)=>{
                this.stats = res.data
            })
            .catch( err =>{
                this.failed = true
                this.errData = err
            })
            .finally(()=>{
                this.loading = false
            })
        },

        reset(){
            this.order_by = ""
            this.direction = ""
        }
    },

    watch : {
        async queryParameters(){
           if (!this.loading) {
             await this.getStats()
         }
     }
 }
}