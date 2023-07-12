export default {
    data(){
        return {
            loading : false,
            fetching : false,
            stats : [],
            failed : false,
            errData : undefined,
            order_by : 'amount_outstanding',
            direction : 'desc',
            limit : '',
            to : undefined,
            from : undefined,
            pagination : undefined,
        }
    },

    computed : {
        orderables(){
            return [
            {value : 'quantity_purchased', text : 'Quantity Purchased'},
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
            ${this.to && this.from ? '&end='+this.to+'&start='+this.from : ''}
            `
        },
    },

    methods : {
        async getStats(){
            this.loading = true
            this.failed = false
            this.errData = undefined
            await this.$axios.$get(`/reports/store/product-performance?paginate=25?${this.queryParameters}`)
            .then((res)=>{
                this.stats = res.data
                this.pagination = res.meta.pagination
            })
            .catch( err =>{
                this.failed = true
                this.errData = err
            })
            .finally(()=>{
                this.loading = false
            })
        },


        async loadExtraData(){
            this.fetching = true
            this.failed = false
            this.errData = undefined
            await this.$axios.$get(this.pagination.links.next)
            .then(async(res)=>{
                await res.data.forEach((entry)=>{
                    this.stats.push(entry)
                })
                this.pagination = res.meta.pagination
            })
            .catch((err)=>{
                this.failed = true
                this.errData = err
            })
            .finally(()=>{
                this.fetching = false
            })
        },

        reset(){
            this.order_by = "amount_outstanding"
            this.direction = "desc"
            this.limit = ""
            this.to = undefined
            this.from = undefined
        }
    },

    watch : {
        async queryParameters(){
            await this.getStats()
        }
    }
}