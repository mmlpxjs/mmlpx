# mmlpx

[![Build Status](https://img.shields.io/travis/mmlpxjs/mmlpx.svg?style=flat-square)](https://travis-ci.org/mmlpxjs/mmlpx)
[![npm version](https://img.shields.io/npm/v/mmlpx.svg?style=flat-square)](https://www.npmjs.com/package/mmlpx)
[![npm downloads](https://img.shields.io/npm/dt/mmlpx.svg?style=flat-square)](https://www.npmjs.com/package/mmlpx)
[![coverage](https://img.shields.io/codecov/c/github/mmlpxjs/mmlpx.svg?style=flat-square)](https://codecov.io/gh/mmlpxjs/mmlpx)

mmlpx is abbreviation of **mobx model layer paradigm**

## Layers

> ViewModel: page interaction logic, constructed and destroyed with the component lifecycle
>
> Store: business logic and rules, singleton in a application
>
> Loader: data accecssor for remote or local data fetching, converting the data structure to match definited model

![](https://github.com/mmlpxjs/mmlpx/blob/gh-pages/assets/mmlpx.png?raw=true)

## Example

Loader

```ts
class UserLoader {
    async getUser() {
        const user = await this.http.get('/user');
        return {
            name: user.userName,
            age: user.userAge,
        }
    }
}
```

Store

```ts
import { observable, action } from 'mobx';
import { Store, inject } from 'mmlpx';
import UserLoader from './UserLoader';

@Store
class UserStore {
    
    @inject()
    loader: UserLoader;
    
    @observable
    name: string;
    
    @action
    async fetchUserName() {
        const user = await this.loader.getUser();
        this.name = user.name;
    }
}
```

ViewModel

```ts
import { observable, action } from 'mobx';
import { postConstruct, ViewModel, inject } from 'mmlpx';

@ViewModel
class AppViewModel {
    
    @inject()
    userStore: UserStore;
    
    @observable loading = true;
    
    @computed
    get userName() {
        return this.userStore.name;
    }
    
    @action
    setLoading(loading: boolean) {
        this.loading = loading;
    }
    
    @action
    @postConstruct
    async onInit() {
        await this.userStore.fetchUser();
        this.loading = false;
    }
}
```

Component

```jsx
export default App extends Component {
    
    @inject()
    vm: AppViewModel;
    
    render() {
        const { loading, userName } = this.vm;
        return (
            <div>
                {loading ? <Loading/> : <p>{userName}</p>} 
            </div>
        );
    }
}
```

