import {EMPTY, empty, fromEvent, interval, Observable, of, zip, Subscriber, timer} from 'rxjs';
import {map,switchMap,distinctUntilChanged,debounceTime, filter} from "rxjs/operators";



const sequence$$: Observable<Event> = fromEvent(document, 'input')
    .pipe(
        map((event: Event) => (<HTMLInputElement>event.target).value),
        //filter(value => value && value.length),
        debounceTime(1000),
        distinctUntilChanged(),
        //switchMap((value) => request(value)),
        switchMap((value) => value.trim()?request(value): []),
    );

function request(value: any): Promise<any> {
    return fetch('https://api.github.com/search/repositories?q=' + value + '&sort=stars')
        .then((res: Response) => res.json()).catch();
}

sequence$$
    .subscribe(
        (data) =>{document.getElementById("json").innerHTML = getData((<any>data).items);},
        (err)=> {console.error(err)},
        () => {console.log('complete')}
    );

function getData(data: Array<Object> = []): string{
    return data.map((value: any) => `<div><a href="${value.html_url}">${value.full_name}</a></div>`).join('') || '';
}
