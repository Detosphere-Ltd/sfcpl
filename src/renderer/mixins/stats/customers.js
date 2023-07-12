export default {
    data(){
        return {
            loading : false,
            stats : [],
            failed : false,
            errData : undefined,
            order_by : 'amount_outstanding',
            direction : 'desc',
            limit : ''
        }
    },

    computed : {
        orderables(){
            return [
            {value : 'amount', text : 'Amount'},
            {value : 'quantity', text : 'Quantity'},
            {value : 'discount_given', text : 'Discount Given'},
            {value : 'amount_paid', text : 'Amount Paid'},
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
            ${this.limit ? '&limit='+this.limit : ''}
            `
        },
    },

    methods : {
        async getStats(){
            this.loading = true
            this.failed = false
            this.errData = undefined
            await this.$axios.$get(`/statistics/customers?${this.queryParameters}`)
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
            this.order_by = "amount_outstanding"
            this.direction = "desc"
            this.limit = ""
        }
    },

    watch : {
        async queryParameters(){
            await this.getStats()
        }
    }
}