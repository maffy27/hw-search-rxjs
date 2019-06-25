import { EMPTY, empty, fromEvent, interval, Observable, of, zip,Subscriber } from 'rxjs';
import {
    catchError, delay,
    filter,
    map,
    mergeAll,
    mergeMap,
    retry,
    retryWhen,
    skip,
    switchAll,
    switchMap,
    take,
    tap,
    distinctUntilChanged,
    debounceTime
} from "rxjs/operators";

const sequence$$: Observable<Event> = fromEvent(document, 'input')
    .pipe(
        map((event: Event) => (<HTMLInputElement>event.target).value),
        //distinctUntilChanged(),
        //filter(value => value),
        debounceTime(100),
        switchMap((value) => request(value))
    );

function request(value:string): Promise<any> {
    return fetch('https://api.github.com/search/repositories?q=' + value + '&sort=stars')
        .then((res: Response) => res.json()).catch();
}

sequence$$
    .subscribe(
        (x) =>{document.getElementById("json").innerHTML = getData((<any>x).items);},
        (err)=> { console.error(err)},
        () => {console.log('complete')}
    );

function getData(data: Array<Object> = []): string{
    return data.map((value: any) => `<div><a href="${value.html_url}">${value.full_name}</a></div>`).join('') || '';
}


