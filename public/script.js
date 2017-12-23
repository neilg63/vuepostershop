var vm = new Vue({
	el: '#app',
	data: {
		total: 0.0,
		products: [],
		items: [],
		cart: [],
		search: 'anime',
		lastSearch: '',
		loading: false,
		step: 5
	},
	mounted: function() {
		this.onSubmit();
		var vi = this;
		var elem = document.getElementById('product-list-bottom');
		var watcher = scrollMonitor.create(elem);
		watcher.enterViewport(function() {
			vi.addItems();
		});
	},
	computed: {
		noMoreItems: function() {
			return this.products.length > 0 && this.items.length >= this.products.length;
		}
	},
	methods: {
		addItem: function(index) {
			if (index >= 0 && index < this.items.length) {
				var item = this.items[index], matched = false;
				for (var i = 0; i < this.cart.length; i++) {
					if (this.cart[i].id == item.id) {
						this.cart[i].qty += 1;
						matched = true;
						break;
					}
				} 
				if (!matched) {
					this.cart.push({
						id: item.id,
						title: item.title,
						price: item.price,
						qty: 1
					});
				}
				this.total += item.price;
			}
			
		},
		inc: function(item) {
			item.qty += 1;
			this.total += item.price;
		},
		dec: function(item) {
			if (item.qty > 0) {
				item.qty -= 1;
				this.total -= item.price;
			}
			if (item.qty < 1) {
				for (var i = 0; i < this.cart.length; i++) {
					if (this.cart[i].id == item.id) {
						this.cart.splice(i,1);
						break;
					}
				}
			}
		},
		onSubmit: function() {
			this.items = [];
			this.products = [];
			this.loading = true;
			this.$http
				.get('/search/'.concat(this.search))
				.then(function(res) {
					if (res.body instanceof Array) {
						this.products = res.data;
						this.loading = false;
						this.lastSearch = this.search;
						this.addItems();
					}
			}, function(error) {

			});
		},
		addItems: function() {
			var start = this.items.length,
				num = this.products.length;
			if (start < num) {
				var max = start + this.step, item;
				if (num < this.step || max > num) {
					max = num;
				}
				for (var i=start; i < max; i++) {
					item = this.products[i];
					if (item.height) {
						if (typeof item.height == 'number' ) {
							item.price = item.height / 100;
							this.items.push(item);
						}
					}
				}
			}
		}
	},
	filters: {
		currency: function(price) {
			if (typeof price == 'number' && price != NaN) {
				return '£' + price.toFixed(2);
			}
		}
	}
});

