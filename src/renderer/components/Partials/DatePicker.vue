<template>
	<date-range-picker v-model="dateRange" class="background uk-padding-remove rouned" @update="passOnDates" :min-date="startFrom" :max-date="$moment().toISOString()" :linked-calendars="false" show-dropdowns :opens="alignment">
		<div slot="header" slot-scope="header" class="tiny-padding border-bottom background rounded-top">
			<h4 class="uk-margin-remove">
				Select date range to filter records.
			</h4>
		</div>
		<template #input="picker" >
			<div class="uk-width-medium">
				<input  type="text" class="uk-input  uk-text-small" readonly :value="`${$moment(picker.startDate).format('DD MMM, YYYY')} - ${$moment(picker.endDate).format('DD MMM, YYYY')}`">
			</div>
		</template>

		<template #date="data">
			<span class="small">{{ data.date | dateCell }}</span>
		</template>
		<!--    ranges (new slot syntax) -->
		<template #ranges="ranges">
			<div class="ranges background">
				<ul>
					<li v-for="(range, name) in ranges.ranges" :key="name" @click="ranges.clickRange(range)">
						<b>{{ name }}</b> <br>

						<small>
							{{ range[0].toDateString() }} - {{ range[1].toDateString() }}
						</small>
					</li>
				</ul>
			</div>
		</template>

		<div slot="footer" slot-scope="data" class="uk-flex uk-flex-right tiny-padding border-top background rounded-bottom">
			<button @click="data.clickCancel"  class="uk-button uk-button-danger uk-button-small uk-margin-small-right">Cancel</button>
			<button @click="data.clickApply" v-if="!data.in_selection" class="uk-button uk-button-primary uk-button-small">Apply Selection</button>
		</div>
	</date-range-picker>
</template>
<script>
import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

export default {
	components: { DateRangePicker },
	data () {
		let startDate = new Date()
		let endDate = new Date()
		return {
			dateRange: {startDate, endDate}
		}
	},

	props : {
		startFrom : {
			type : String,
		default : ''
		},

		endOn : {
			type : String,
		default : ''
		},
		alignment : {
		default : 'right'
		}
	},

	filters: {
		dateCell (value) {
			let dt = new Date(value)

			return dt.getDate()
		},
		date (val) {
			return val ? val.toLocaleString() : ''
		}
	},

	methods : {
		passOnDates(payload){
			this.$emit('date-set', payload)
		}
	},

	created(){
		this.dateRange.startDate = this.startFrom ? this.$moment(this.startFrom) : this.emporium.created_at 
		this.dateRange.endDate = this.endOn ? this.$moment(this.endOn) : this.$moment()
		this.$emit('date-set', this.dateRange)
	}
}
</script>
