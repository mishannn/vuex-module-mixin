import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState('module', [
      'measure',
      'mapSize',
      'controls',
      'searchItem',
      'mapIconCenter',
      'selectedColor',
      'mapCenterFilterMenuActive',
    ]),
    ...mapGetters('module', ['activeControls', 'disabledConrols']),
  },
  methods: {
    ...mapMutations('module', [
      'setSearchItem',
      'setSelectedColor',
      'disableMeasure',
      'enableMeasure',
      'toggleMeasure',
      'toggleControl',
      'disableAllControls',
      'disableControl',
      'setMapSize',
      'setMapCenterFilterMenuActive',
    ]),
  },
};
