import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getContacts from '@salesforce/apex/DragNDropDataService.getContacts';
import updateContact from '@salesforce/apex/DragNDropDataService.updateContact';

export default class DragNDrop extends LightningElement {

    @api account1Id;
    @api account2Id;
 
    account1Name;
    account2Name;

    @track contacts1;
    @track contacts2;

    isLoading = false;

    connectedCallback(){
        if(!this.account1Id || !this.account2Id){
            this.handleAccountIdsMissing();
            return;
        }
        this.handleGetContacts();
    }

    get account1NameHelper(){
        if(this.account1Name){
            return `${this.account1Name} contacts`
        }
        return `Not account1 found`;
    }

    get account2NameHelper(){
        if(this.account2Name){
            return `${this.account2Name} contacts`
        }
        return `Not account2 found`;
    }

    handleAccountIdsMissing = () => {
        const event = new ShowToastEvent({
            title: 'Error',
            variant : "error",
            message:
                'Please configure AccountId\'s in the App Builder before starting the component',
        });
        this.dispatchEvent(event);
    }

    handleGetContacts = async () => {
        this.isLoading = true;
        let res = await getContacts({account1Id : this.account1Id, account2Id : this.account2Id});
        this.contacts1 = [];
        this.contacts2 = [];
        this.account1Name = null;
        this.account2Name = null;
        for(let i in res){
            if(!this.account1Name){
                this.account1Name = i;
                this.contacts1 = res[i];
            }
            else{
                this.account2Name = i;
                this.contacts2 = res[i];
            }
        }
        this.isLoading = false;
    }

    drag = (event) => {
        event.dataTransfer.setData("contactId", event.target.dataset.contact);
        event.dataTransfer.setData("accountId", event.target.dataset.account);
    }

    allowDrop = (event) => {
        event.preventDefault();
    }

    drop = (event) => {
        event.preventDefault();
        let contactId = event.dataTransfer.getData("contactId");
        let accountId = event.dataTransfer.getData("accountId");
        this.handleUpdateContacts(contactId, accountId);
    }

    handleUpdateContacts = async (contactId, accountId) => {
        let newAccountId;
        if(accountId === this.account1Id){
            newAccountId = this.account2Id;
        }
        else{
            newAccountId = this.account1Id;
        }
        this.isLoading = true;
        await updateContact({contactId : contactId, accountId : newAccountId});
        this.handleGetContacts();
    };
}