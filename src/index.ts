import {fromEvent, Observable, timer} from 'rxjs';
import {switchMap,distinctUntilChanged,debounceTime, filter, tap, pluck, retryWhen, delayWhen} from "rxjs/operators";
import {ajax} from "rxjs/internal/observable/dom/ajax";
import "./style.css";

//тут был Observable<Event>
const sequence$$: Observable<any> = fromEvent(document, 'input')
    .pipe(
        pluck('target', 'value'),
        filter((value: any) => value.trim()!=''), //почему если указать value: string летит ошибка?
        debounceTime(500),
        distinctUntilChanged(),
        tap(()=> setLoading()),
        //switchMap( (value:string) => request(value)),
        switchMap( (value: string) => ajax.getJSON(`https://api.github.com/search/repositories?q=${value}&sort=stars`)
            .pipe(
                retryWhen(errors =>
                    errors.pipe(
                        tap(val => console.log('error ' + val)),
                        delayWhen(() => timer(15000))
                    )
                )
            )
        )
    );

sequence$$
    .subscribe(
        (data) =>{document.getElementById("json").innerHTML = getData(data.items);},
        (err)=> {console.log('error: ', err)},
        () => {console.log('complete')}
    );

function getData(data: Array<Object>): string{
    if (!data.length) { return  `<div class="no-result-item"><h3>We couldn’t find any repositories</h3></div>`}
    return data.map((value: any) => `<div class="result-item">
                                                <h3><a href="${value.html_url}">${value.full_name}</a></h3>
                                                <p>${value.description ? value.description : 'there is no description'}</p>
                                           </div>`).join('');
}

function setLoading(): void{
    document.getElementById("json").innerHTML = `<div class="loading"></div>`;

}







//map((event: Event) => (<HTMLInputElement>event.target).value),

// function request(value: string): Promise<any> {
//     return fetch(`https://api.github.com/search/repositories?q=${value}&sort=stars`)
//         .then((res: Response) => res.json());
// }
