<template>
  <div>

    <section class="uk-section uk-section-small uk-padding-remove-bottom">
      <div class="uk-container uk-container-xlarge">
        <div class="uk-width-1-1">
          <div class="uk-width-1-1 uk-flex uk-flex-between uk-flex-bottom">
            <div class="uk-width-xlarge uk-flex uk-flex-column uk-flex-middle uk-margin-auto">


              <p class="uk-text-center uk-margin-remove">
                {{$moment().format('dddd, MMMM DD')}}
              </p>
              <p class="uk-text-center uk-text-lead uk-margin-bottom">
                {{greetings}}
              </p>
              <div class="uk-width-1-1  tiny-padding background raised bordered pill uk-text-truncate" v-if="can('view-store-statistics')">
                <stats-generic-summary></stats-generic-summary>
              </div>
            </div>
            <div class="uk-width-auto uk-flex uk-flex-right">

              <nuxt-link :to="{name: 'customize'}" class="chip background click uk-flex uk-flex-middle bordered rounded uk-margin-small-right" v-if="can(['update-store', 'manage-store-logo', 'setup-store'])">
                <span class="mdi mdi-shape-plus tiny-margin-right"></span>
                <span>
                 Store Settings
               </span>
             </nuxt-link>
             <nuxt-link :to="{name: 'profile'}" class="chip background click uk-flex uk-flex-middle bordered rounded">
              <span class="mdi mdi-plus-circle-multiple-outline tiny-margin-right"></span>
              <span>
                Manage Profile
              </span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </section>


  <section class="uk-section uk-section-small">
    <div class="uk-container uk-container-xlarge">

      <div class="uk-width-1-1 uk-flex uk-flex-wrap uk-grid-collapse" uk-grid="masonry: true"> 

        <div class="uk-width-1-2 grid-gutter" v-if="!emporium.setup_completed && can('setup-store')" >
          <div class="bordered bordered uk-border-rounded uk-padding-small uk-margin-small-bottom">
            <div class="uk-flex uk-flex-column uk-width-4-5@l">
             <small class="uk-text-uppercase uk-text-bold uk-margin-small-bottom">
               Setup Guide
             </small>

             <h3>
               Continue setting up
             </h3>
             <p>
              You’re almost done setting up! Pick up where you left off to get {{emporium.name}} up and running on {{$appName}}.
            </p>

            <div class="uk-flex uk-flex-middle">
              <nuxt-link :to="{name : 'onboarding'}" class="uk-button uk-button-primary uk-margin-right">
               Set Up Store
             </nuxt-link>

             <onboarding-skip @done="$auth.fetchUser()">
              <button class="uk-button uk-button-view uk-button-small uk-active" slot="action-button">
                Skip Process
              </button>
            </onboarding-skip>
          </div>
        </div>
      </div>
    </div>




    <div class="grid-gutter uk-padding-remove-top uk-width-1-2@m uk-flex uk-flex-wrap uk-grid-collapse" uk-grid="masonry: true">

      <div class="uk-width-1-2 grid-gutter" v-if="can('view-sales-statistics')">
        <div class="uk-width-1-1">
          <lazy-stats-generic-sales>
          </lazy-stats-generic-sales>
        </div>
      </div>

      <div class="uk-width-1-2 grid-gutter">
        <div class="uk-width-1-1 uk-margin-small-bottom" v-if="can('view-store-statistics')">
          <lazy-stats-sales-payments  class="bordered" >
          </lazy-stats-sales-payments>
        </div>

        <div class="uk-width-1-1"  v-if="can('view-transfers-statistics')">
          <lazy-stats-store-transfers class="bordered" >
          </lazy-stats-store-transfers>
        </div>
      </div>
      <div class="uk-width-1-2 grid-gutter">
        <div class="uk-width-1-1 uk-margin-small-bottom" v-if="can('view-customers-statistics')">
          <lazy-stats-store-last-thirty class="bordered">
          </lazy-stats-store-last-thirty>
        </div>
        <div class="uk-width-1-1" v-if="can('view-transfer-requests-statistics')">
          <lazy-stats-store-transfer-requests class="bordered" >
          </lazy-stats-store-transfer-requests>
        </div>
      </div>

    </div>

    <div class="grid-gutter uk-padding-remove-top uk-width-1-2@m uk-padding-remove-left">

      <div class="uk-width-1-1 uk-margin-small-bottom">
        <stats-generic-overview class="bordered" v-if="can('view-sales-statistics')">
        </stats-generic-overview>
      </div>
      <stats-sales-items  class="bordered uk-width-1-1" v-if="can('view-sales-statistics')"></stats-sales-items>
    </div>
  </div>

</div>
</section>

</div>
</template>
<script>
import {greetings} from "@/mixins/utils"
export default{
  mixins : [greetings],
  head(){
    return {
      title : `${this.$appName} | ${this.emporium.name} - Dashboard`
    }
  },
};
</script>

