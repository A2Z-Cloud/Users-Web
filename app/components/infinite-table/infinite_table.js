import './infinite_table.css!'
import tmpl from './infinite_table.html!text'
import Vue from 'vue'


export default Vue.extend({
    template: tmpl,
    props: [
        'columns',
        'fetch',
        'display_table_cell_type',
        'display_table_cell',
        'item_clicked',
    ],
    data: () => ({
        items: [],
        search_term: '',
        exhausted: false,
        busy: false,
        table_body_distance_from_top: 0,
    }),
    computed: {
        searching() {
            return (this.search_term.length > 0)
        },
        table_height() {
            return (this.window_height - this.table_body_distance_from_top - 32) + 'px'
        },
        disabled() {
            return (!this.searching && this.items_exhausted)
                || (this.searching && this.search_exhausted)
        },
    },
    ready() {
        this.table_body_distance_from_top = this.$els.tableBody.getBoundingClientRect().top
    },
    vuex: {
        getters: {
            window_height: state => state.window_size.height,
        },
    },
    methods: {
        display_item_is_template(item, {column}) {
            if (this.display_table_cell_is_template) return this.display_table_cell_is_template(item, {column})
            return false
        },
        display_item(item, {column}) {
            if (this.display_table_cell) return this.display_table_cell(item, {column})
            return item[column]
        },
        fetch_items(offset=0) {
            this.busy = true
            this.fetch(this.search_term, offset)
                .then((items) => {
                    this.busy = false
                    // extend or replace items list (offset will be set when fetching next page)
                    if(offset >= this.items.length) this.items.push(...items)
                    else this.items = items
                })
                .catch(() => {
                    this.exhausted = true
                    this.busy = false
                })
        },
        nearing_bottom() {
            this.fetch_items(this.items.length)
        },
        _item_clicked(item) {
            if (this.item_clicked) this.item_clicked(item)
        },
    },
})
