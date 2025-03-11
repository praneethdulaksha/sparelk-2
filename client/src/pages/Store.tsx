import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faSquareEnvelope, faSquarePhoneFlip, faSquarePollHorizontal, faXmark } from '@fortawesome/free-solid-svg-icons';
import { TStore } from '../types';
import ItemCard from '../components/ItemCard';
import { items as testItems } from '../data/items';
import { api } from '../api/api';

export default function Store() {
    const param = useParams();
    const storeId = param.storeId;

    if (!storeId) return null;

    const [store, setStore] = useState<TStore | null>();
    const [items, setItems] = useState(testItems);
    const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);

    useEffect(() => {
        getStoreData(storeId);
    }, [])

    const getStoreData = (storeId: string) => {
        api.get('store/' + storeId).then(response => {
            setStore(response.data.data);
            getStoreItems(storeId);
        }).catch(err => console.log(err));
    }

    const getStoreItems = (storeId: string) => {
        api.get('item/store/' + storeId).then(response => {
            setItems(response.data.data);
        }).catch(err => console.log(err));
    }

    return store && (
        <main className="container xl:max-w-7xl flex-grow py-5">
            <div>
                <div className='bg-gray-600 text-white'>
                    <h2 className="px-5 mb-3 text-xl sm:text-2xl md:text-4xl lg:text-5xl">{store.name} Store</h2>
                </div>
                <div className='my-2 w-full aspect-store-image bg-cover bg-center border flex justify-end' style={{ backgroundImage: `url(/slider1.jpg)` }}>
                    {isStoreInfoOpen && <FontAwesomeIcon icon={faCircleInfo} className='m-4 text-xl md:text-2xl lg:text-3xl text-gray-200 hover:scale-110 duration-75 animate-pulse' onClick={() => setIsStoreInfoOpen(!isStoreInfoOpen)} />}
                    {!isStoreInfoOpen && <div className='self-start flex flex-col items-end px-2 bg-gray-300 rounded-lg m-2'>
                        <h4><FontAwesomeIcon icon={faXmark} className='text-xl md:text-2xl lg:text-3xl hover:scale-110 duration-75' onClick={() => setIsStoreInfoOpen(!isStoreInfoOpen)} /></h4>
                        <h4 className='text-sm sm:text-lg md:text-xl'>{store.phone} <FontAwesomeIcon icon={faSquarePhoneFlip} /></h4>
                        <h4 className='text-sm sm:text-lg md:text-xl'>{store.email} <FontAwesomeIcon icon={faSquareEnvelope} /></h4>
                        <h4 className='text-sm sm:text-lg md:text-xl'>{store.address} <FontAwesomeIcon icon={faSquarePollHorizontal} /></h4>
                    </div>}
                </div>
            </div>
            <h2 className="px-5 my-3 text-2xl md:text-4xl">All Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 place-items-center gap-3">
                {
                    items.map((item, i) => {
                        return <ItemCard key={i} itm={item} />
                    })
                }
            </div>
        </main>
    )
}
