<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            class="newQwitt"
            bottom-slots
            v-model="newQwitter"
            placeholder="What's happening?"
            counter
            maxlength="280"
            :dense="dense"
            autogrow
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addQwitt"
            class="q-mb-lg"
            unelevated
            rounded
            color="primary"
            label="Qwitt"
            no-caps
            :disable="!newQwitter"
          />
        </div>
      </div>
      <q-separator class="divider" size="10px" color="grey-2" />

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item v-for="qwitt in qwitts" :key="qwitt.id" class="q-py-md">
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold text-subtitle1"
                >Anna Andrea
                <span class="text-grey-7"
                  >@annaandrea.com <br class="lt-md" />
                  &bull; {{ relativeDate(qwitt.date) }}</span
                ></q-item-label
              >
              <q-item-label class="qwitt-content text-body1">
                {{ qwitt.content }}
              </q-item-label>
              <div class="qwitt-icons row justify-between q-mt-sm">
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="las la-comment"
                  size="sm"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="las la-retweet"
                  size="sm"
                />
                <div class="row items-center">
                <q-btn
                @click="qwitt.liked? unlikeQwitt(qwitt) : likeQwitt(qwitt)"
                  flat
                  round
                  :color="qwitt.liked? 'red' : 'grey' "
                  icon="las la-heart"
                  size="sm" />
                  <span
                  v-if="qwitt.like"
                  class="text-grey ">{{
                  qwitt.like
                  }}</span>
                </div>
                <q-btn
                  @click="deleteQwitt(qwitt)"
                  flat
                  round
                  color="grey"
                  icon="las la-trash"
                  size="sm"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { formatDistance } from 'date-fns';
import db from 'src/boot/firebase';
import { collection, query, orderBy, onSnapshot, doc, addDoc, deleteDoc, updateDoc, increment} from 'firebase/firestore';

export default defineComponent({
  name: 'PageHome',

  data() {
    return {
      newQwitter: '',
      qwitts: [],
    };
  },
  methods: {
    relativeDate(value) {
      return formatDistance(value, new Date());
    },
    async addQwitt() {
      const docRef = await addDoc(collection(db, 'qwitts'), {
      content: this.newQwitter,
      date: Date.now(),
      like: 0,
      liked:false
    });
      this.newQwitter = '';
    },
    async deleteQwitt(qwitt) {
      await deleteDoc(doc(db, "qwitts", qwitt.id));    
    },
    async likeQwitt(qwitt) {
      let updateQwitt = doc(db, "qwitts", qwitt.id);
      await updateDoc(updateQwitt, {
        like: increment(1),
        liked: true
      });
      qwitt.liked = true
    },
      async unlikeQwitt(qwitt) {
      let updateQwitt = doc(db, "qwitts", qwitt.id);
      await updateDoc(updateQwitt, {
        like: increment(-1),
        liked: false
      });
      qwitt.liked = false
    }
  },
  mounted() {

const q = query(collection(db, "qwitts"), orderBy("date"));
const unsubscribe = onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    let qwittChange = change.doc.data()
    qwittChange.id = change.doc.id
    if (change.type === "added") {
        console.log("New qwitt: ", qwittChange);
        this.qwitts.unshift(qwittChange)
    }
    if (change.type === "modified") {
        console.log("Modified qwitt: ", qwittChange);
    }
    if (change.type === "removed") {
        console.log("Removed qwitt: ", qwittChange);
        let index = this.qwitts.findIndex(qwitt => qwitt.id === qwittChange.id)
        this.qwitts.splice(index, 1)
    }
  });
});
  },
});
</script>

<style lang="sass">
.newQwitt
  textarea
     font-size: 19px
     line-height: 1.4 !important
.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.qwitt-content
  white-space: pre-line !important
.qwitt-icons
  margin-left: -5px
</style>
