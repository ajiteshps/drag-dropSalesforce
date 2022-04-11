/**
 * @description       : 
 * @author            : Ajitesh
 * @group             : 
 * @last modified on  : 04-11-2022
 * @last modified by  : Ajitesh
**/
public inherited sharing class DragNDropDataService {
    
    @AuraEnabled
    public static Map<String,List<Contact>> getContacts(Id account1Id, Id account2Id){
        try {   
            Map<String,List<Contact>> mapOfAccountToContacts = new Map<String,List<Contact>>();
            mapOfAccountToContacts.put([SELECT Name FROM Account WHERE Id=:account2Id].Name, [SELECT Id, Name, Title, Email, Phone, AccountId FROM Contact WHERE AccountId=:account2Id ]);
            mapOfAccountToContacts.put([SELECT Name FROM Account WHERE Id=:account1Id].Name, [SELECT Id, Name, Title, Email, Phone, AccountId FROM Contact WHERE AccountId=:account1Id ]);
            System.debug(mapOfAccountToContacts);
            return mapOfAccountToContacts;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }  
    }

    @AuraEnabled
    public static void updateContact(Id contactId, Id accountId){
        try {
            Contact newC =new Contact(Id = contactId, AccountId = accountId);
            update newC;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
