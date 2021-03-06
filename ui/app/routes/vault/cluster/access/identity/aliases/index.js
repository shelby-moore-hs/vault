import Ember from 'ember';
import ListRoute from 'vault/mixins/list-route';

export default Ember.Route.extend(ListRoute, {
  model(params) {
    let itemType = this.modelFor('vault.cluster.access.identity');
    let modelType = `identity/${itemType}-alias`;
    return this.store
      .lazyPaginatedQuery(modelType, {
        responsePath: 'data.keys',
        page: params.page,
        pageFilter: params.pageFilter,
        size: 100,
      })
      .catch(err => {
        if (err.httpStatus === 404) {
          return [];
        } else {
          throw err;
        }
      });
  },
  setupController(controller) {
    this._super(...arguments);
    controller.set('identityType', this.modelFor('vault.cluster.access.identity'));
  },
  actions: {
    willTransition(transition) {
      window.scrollTo(0, 0);
      if (transition.targetName !== this.routeName) {
        this.store.clearAllDatasets();
      }
      return true;
    },
  },
});
