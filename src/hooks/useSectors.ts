
import { useGlobalData } from '@/contexts/GlobalDataContext';
import { Sector } from '@/types/global';

export const useSectors = () => {
  const { sectors, updateSector, addSector, removeSector } = useGlobalData();

  const getSectorById = (id: string): Sector | undefined => {
    return sectors.find(sector => sector.id === id);
  };

  const getActiveSectors = (): Sector[] => {
    return sectors.filter(sector => sector.ativo);
  };

  const searchSectors = (searchTerm: string): Sector[] => {
    const term = searchTerm.toLowerCase();
    return sectors.filter(sector => 
      sector.nome.toLowerCase().includes(term) ||
      sector.descricao?.toLowerCase().includes(term)
    );
  };

  return {
    sectors,
    updateSector,
    addSector,
    removeSector,
    getSectorById,
    getActiveSectors,
    searchSectors
  };
};
