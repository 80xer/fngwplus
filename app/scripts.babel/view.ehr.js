class EhrView {
	constructor() {
		this.$ehr = $('<div>EHR</div>')
		this.target = '.txt.single_txt'
	}

	setView() {
		this.$ehr.insertAfter(this.target)
	}
}
