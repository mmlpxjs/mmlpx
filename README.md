# mmlpx

[![npm version](https://img.shields.io/npm/v/mmlpx.svg?style=flat-square)](https://www.npmjs.com/package/mmlpx)
[![coverage](https://img.shields.io/codecov/c/github/mmlpxjs/mmlpx.svg?style=flat-square)](https://codecov.io/gh/mmlpxjs/mmlpx)
[![npm downloads](https://img.shields.io/npm/dt/mmlpx.svg?style=flat-square)](https://www.npmjs.com/package/mmlpx)
[![Build Status](https://img.shields.io/travis/mmlpxjs/mmlpx.svg?style=flat-square)](https://travis-ci.org/mmlpxjs/mmlpx)

mmlpx is abbreviation of **mobx model layer paradigm**, inspired by [CQRS](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)

## Architecture

![](https://github.com/mmlpxjs/mmlpx/blob/gh-pages/assets/mmlpx.png?raw=true)

### Loader

Data accessor for remote or local data fetching, converting the data structure to match definited model

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

### Store

Business logic and rules, singleton in an application

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

### ViewModel

Page interaction logic, constructed and destroyed with the component lifecycle

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

### Component

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

