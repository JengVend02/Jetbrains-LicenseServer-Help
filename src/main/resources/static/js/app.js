// Vue 3 主应用
const { createApp } = Vue

// 主应用组件
const App = {
  data() {
    return {
      currentPage: Utils.getCurrentPage(),
      showConfigModal: false,
      showLicenseModal: false,
      showResultModal: false,
      showPowerConfModal: false,
      powerConfContent: '',
      isGenerating: false,
      config: {
        licenseName: '',
        assigneeName: ''
      },
      licenseConfig: {
        expiryDate: '',
        licenseType: 'PERPETUAL',
        userCount: 1
      },
      selectedItem: null,
      generatedLicense: '',
      products: [],
      plugins: [],
      filteredProducts: [],
      filteredPlugins: [],
      searchQuery: '',
      navItems: [
        { id: 'home', name: '首页', icon: 'fas fa-home' },
        { id: 'products', name: '产品', icon: 'fas fa-cube' },
        { id: 'plugins', name: '插件', icon: 'fas fa-puzzle-piece' },
        // { id: 'jrebel', name: 'JRebel', icon: 'fas fa-fire' },
        // { id: 'sponsor', name: '赞助', icon: 'fas fa-heart' }
      ],
      showBackToTop: false
    }
  },

  computed: {
    serverUrl() {
      return `${window.location.origin}`
    },

    jrebelServerUrl() {
      const uuid = Utils.generateUUID()
      return `${window.location.origin}/${uuid}`
    }
  },

  watch: {
    searchQuery(newQuery) {
      this.filterItems(newQuery)
    },

    currentPage() {
      this.searchQuery = ''
      this.filteredProducts = [...this.products]
      this.filteredPlugins = [...this.plugins]
    }
  },

  mounted() {
    this.loadConfig()
    this.loadProducts()
    this.loadPlugins()
    this.setDefaultExpiryDate()
    Utils.loadTheme()

    this.handleHashChange = () => {
      this.currentPage = Utils.getCurrentPage()
      this.searchQuery = ''
      this.filteredProducts = [...this.products]
      this.filteredPlugins = [...this.plugins]
    }

    Utils.onHashChange(this.handleHashChange)

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.showBackToTop = scrollTop > 300
    }

    window.addEventListener('scroll', handleScroll)
    this._handleScroll = handleScroll
  },

  beforeUnmount() {
    if (this.handleHashChange) {
      Utils.removeHashChangeListener(this.handleHashChange)
    }
    if (this._handleScroll) {
      window.removeEventListener('scroll', this._handleScroll)
      document.removeEventListener('scroll', this._handleScroll)
    }
  },

  methods: {
    loadConfig() {
      const config = StorageService.getConfig()
      if (StorageService.isConfigured()) {
        this.config = config
      } else {
        this.showConfigModal = true
      }
    },

    saveConfig() {
      if (this.config.licenseName && this.config.assigneeName) {
        StorageService.saveConfig(this.config.licenseName, this.config.assigneeName)
        this.showConfigModal = false
        Utils.showNotification('配置保存成功')
      }
    },

    async loadProducts() {
      try {
        this.products = await ApiService.getProducts()
        this.filteredProducts = [...this.products]
      } catch (error) {
        console.error('加载产品列表失败:', error)
        Utils.showNotification('加载产品列表失败', 'error')
      }
    },

    async loadPlugins() {
      try {
        this.plugins = await ApiService.getPlugins()
        this.filteredPlugins = [...this.plugins]
      } catch (error) {
        console.error('加载插件列表失败:', error)
        Utils.showNotification('加载插件列表失败', 'error')
      }
    },

    filterItems(query) {
      const searchTerm = query.toLowerCase().trim()

      if (this.currentPage === 'products') {
        this.filteredProducts = this.products.filter((product) => {
          const nameMatch = product.name.toLowerCase().includes(searchTerm)
          const descriptionMatch = product.description && product.description.toLowerCase().includes(searchTerm)
          const codeMatch = product.productCode && product.productCode.toLowerCase().includes(searchTerm)
          return nameMatch || descriptionMatch || codeMatch
        })
        this.filteredProducts.sort((a, b) => {
          const aScore = this.calculateSearchScore(a, searchTerm)
          const bScore = this.calculateSearchScore(b, searchTerm)
          return bScore - aScore
        })
      } else if (this.currentPage === 'plugins') {
        this.filteredPlugins = this.plugins.filter((plugin) => {
          const nameMatch = plugin.name.toLowerCase().includes(searchTerm)
          const descriptionMatch = plugin.description && plugin.description.toLowerCase().includes(searchTerm)
          const idMatch = plugin.id && plugin.id.toLowerCase().includes(searchTerm)
          return nameMatch || descriptionMatch || idMatch
        })
        this.filteredPlugins.sort((a, b) => {
          const aScore = this.calculateSearchScore(a, searchTerm)
          const bScore = this.calculateSearchScore(b, searchTerm)
          return bScore - aScore
        })
      }
    },

    calculateSearchScore(item, searchTerm) {
      let score = 0
      if (item.name.toLowerCase() === searchTerm) {
        score += 100
      } else if (item.name.toLowerCase().startsWith(searchTerm)) {
        score += 50
      } else if (item.name.toLowerCase().includes(searchTerm)) {
        score += 30
      }
      if (item.description && item.description.toLowerCase().includes(searchTerm)) {
        score += 20
      }
      if ((item.productCode && item.productCode.toLowerCase().includes(searchTerm)) ||
          (item.id && item.id.toLowerCase().includes(searchTerm))) {
        score += 10
      }
      return score
    },

    selectProduct(product) {
      this.selectedItem = product
      this.showLicenseModal = true
    },

    selectPlugin(plugin) {
      this.selectedItem = plugin
      this.showLicenseModal = true
    },

    setExpiryDate(days) {
      const date = new Date()
      date.setDate(date.getDate() + parseInt(days))
      this.licenseConfig.expiryDate = date.toISOString().split('T')[0]
    },

    async generateLicense() {
      this.isGenerating = true
      try {
        const result = await ApiService.generateLicense(this.selectedItem.productCode, this.config.licenseName, this.config.assigneeName, this.licenseConfig.expiryDate)
        this.generatedLicense = result
        this.showLicenseModal = false
        this.showResultModal = true
      } catch (error) {
        console.error('生成激活码失败:', error)
        Utils.showNotification('生成激活码失败，请重试', 'error')
      } finally {
        this.isGenerating = false
      }
    },

    async viewPowerConf() {
      try {
        const response = await fetch(`${ApiService.baseURL}/power-conf`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        this.powerConfContent = await response.text()
        this.showPowerConfModal = true
      } catch (error) {
        console.error('获取 power.conf 失败:', error)
        Utils.showNotification('获取配置文件失败', 'error')
      }
    },

    downloadAgent() {
      ApiService.downloadAgent()
    },

    copyToClipboard(text) {
      Utils.copyToClipboard(text)
    },

    setDefaultExpiryDate() {
      this.licenseConfig.expiryDate = Utils.getDefaultExpiryDate()
    },

    getProductIcon(product) {
      if (product.iconClass && product.iconClass.startsWith('icon-')) {
        const iconName = product.iconClass.replace('icon-', '');
        const iconMap = {
          'ii': 'https://resources.jetbrains.com/storage/logos/web/intellij-idea/intellij-idea.svg',
          'ps': 'https://resources.jetbrains.com/storage/logos/web/phpstorm/phpstorm.svg',
          'ac': 'https://resources.jetbrains.com/storage/logos/web/appcode/appcode.svg',
          'db': 'https://resources.jetbrains.com/storage/logos/web/datagrip/datagrip.svg',
          'rm': 'https://resources.jetbrains.com/storage/logos/web/rubymine/rubymine.svg',
          'ws': 'https://resources.jetbrains.com/storage/logos/web/webstorm/webstorm.svg',
          'rd': 'https://resources.jetbrains.com/storage/logos/web/rider/rider.svg',
          'cl': 'https://resources.jetbrains.com/storage/logos/web/clion/clion.svg',
          'pc': 'https://resources.jetbrains.com/storage/logos/web/pycharm/pycharm.svg',
          'go': 'https://resources.jetbrains.com/storage/logos/web/goland/goland.svg',
          'ds': 'https://resources.jetbrains.com/storage/logos/web/dataspell/dataspell.svg',
          'dc': 'https://resources.jetbrains.com/storage/logos/web/dotcover/dotcover.svg',
          'dpn': 'https://resources.jetbrains.com/storage/logos/web/dottrace/dottrace.svg',
          'dm': 'https://resources.jetbrains.com/storage/logos/web/dotmemory/dotmemory.svg',
          'rr': 'https://resources.jetbrains.com/storage/logos/web/rustrover/rustrover.svg',
          'qa': 'https://resources.jetbrains.com/storage/logos/web/aqua/aqua.svg',
          'al': 'https://resources.jetbrains.com/storage/logos/web/toolbox/toolbox.svg'
        };
        return iconMap[iconName] || '/images/plugin.svg';
      }
      return '/images/plugin.svg';
    },

    getPluginIcon(plugin) {
      return plugin.icon || '/images/plugin.svg'
    },

    navigateTo(page) {
      Utils.navigateToPage(page)
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },

    toggleTheme(event) {
      Utils.toggleTheme(event)
    }
  }
}

const app = createApp(App)
app.component('SponsorComponent', SponsorComponent)
app.mount('#app')
