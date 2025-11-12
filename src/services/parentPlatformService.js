import axios from 'axios'
import whiteLabel from '@/config/whiteLabel'

const parentApi = axios.create({
  baseURL: whiteLabel.integration.parentPlatformApiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

const clientCache = new Map()

export const parentPlatformService = {
  async getClientDetails(externalId) {
    if (clientCache.has(externalId)) {
      return clientCache.get(externalId)
    }

    try {
      const mockClient = await this.getMockClientData(externalId)
      clientCache.set(externalId, mockClient)
      return mockClient
    } catch (error) {
      console.error('Error fetching client details:', error)
      return {
        id: externalId,
        name: 'Cliente',
        email: 'cliente@example.com',
        avatar: null
      }
    }
  },

  async getMockClientData(externalId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const names = [
          'Ana Silva', 'João Santos', 'Maria Oliveira', 'Pedro Costa',
          'Carla Souza', 'Lucas Ferreira', 'Juliana Lima', 'Rafael Alves',
          'Fernanda Rocha', 'Bruno Martins', 'Camila Ribeiro', 'Thiago Dias',
          'Patricia Gomes', 'Rodrigo Castro', 'Amanda Carvalho', 'Gabriel Nunes',
          'Beatriz Araujo', 'Felipe Barros', 'Larissa Moura', 'Daniel Pinto'
        ]
        
        const clientNumber = parseInt(externalId.split('-')[1]) || 1
        const name = names[clientNumber % names.length]
        
        resolve({
          id: externalId,
          name: name,
          email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        })
      }, 200)
    })
  },

  clearCache() {
    clientCache.clear()
  }
}
