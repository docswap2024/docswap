import { Collapse } from 'rizzui';
import { PiCaretDownBold } from 'react-icons/pi';
import { cn } from '@/lib/utils/cn';
import { numberWithCommas, checkIfEmpty } from '@/lib/utils/format';

export const Taxes  = ({ getProperty, propertyType }:{ getProperty: any, propertyType: string }) => {
    const data = [
        {name: 'Zoning', value: propertyType.includes("strata") ? getProperty.Zoning.Value : getProperty.ZoneCode.Value} ,
        {name: 'PID', value: getProperty.PID.Value},
        {name: 'Zone Description', value: propertyType.includes("strata") ? 'N/A' : getProperty.ZoneDesc.Value },
        {name: 'Legal Description', value: getProperty.LegalDetail.Value},
      ];
    
      const taxDataArray: any[] = JSON.parse(getProperty.GrossTaxData.Value);
      return (
        <Collapse
        className="last-of-type:border-t-0 border-b border-muted"
        defaultOpen={true}
        header={({ open, toggle }) => (
            <div
            role="button"
            onClick={toggle}
            className="flex w-full cursor-pointer items-center justify-between py-6 font-lexend text-lg font-semibold text-gray-900"
            >
            <span>
               Taxes
            </span>
            <div className="flex shrink-0 items-center justify-center">
                <PiCaretDownBold
                className={cn(
                    'h-[18px] w-[18px] transform transition-transform duration-300',
                    open && 'rotate-180'
                )}
                />
            </div>
            </div>
        )}
       >
        <div className="-mt-2 pb-7">
          {getProperty.GrossTaxData.Value && (
            <table className="min-w-full text-center text-black">
                <thead className="bg-steel-50/70 border">
                <tr>
                  <th scope='col' className="px-4 py-2 md:px-6 md:py-3 border">Year</th>
                  <th scope='col' className="px-4 py-2 md:px-6 md:py-3 border">Gross Tax</th>
                  <th scope='col' className="px-4 py-2 md:px-6 md:py-3 border">Change</th>
                </tr>
              </thead>
              <tbody>
                {taxDataArray
                .sort((a, b) => b.year - a.year)
                .map((taxInfo, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-grayLight'}`}>
                    <td className="px-2 py-2 md:px-6 md:py-4 border">{checkIfEmpty(taxInfo.year)}</td>
                    <td className="px-2 py-2 md:px-6 md:py-4 border">$ {checkIfEmpty(numberWithCommas(taxInfo.tax))}</td>
                    <td className="px-2 py-2 md:px-6 md:py-4 border">{checkIfEmpty(taxInfo.change)}</td>
                  </tr>
                ))}
              </tbody>
          </table>
          )} 
          </div>
    
          <div className="grid grid-cols-2 md:grid-cols-3 p-4 pt-5">
            {data.map((item, index) => (
              <div className={`min-w-0 flex-auto border-b p-3 ${index === data.length - 1 ? 'col-span-3' : ''} ${index === data.length - 2 ? 'col-span-2 md:col-span-1' : ''}`} key={index}>
                <p className="font-semibold leading-6 text-black uppercase">{item.name}</p>
                <p className="mt-1 leading-5 text-black break-all">{checkIfEmpty(item.value)}</p>
              </div>
            ))}
          </div>
          <p className='p-4 text-xs'><span className='font-semibold'>Note: </span> data provided by BCA / LTSA public record</p>
        </Collapse>
      );
}